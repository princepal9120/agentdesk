"""Generic owner-created outbound call flows, contacts, and campaigns."""

from __future__ import annotations

import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from agent.flow_runtime import normalize_flow
from app.api.deps import get_current_agency
from app.core.database import get_db
from app.models.agency import Agency
from app.models.business import Business, AgentConfig
from app.models.call import Campaign, Call, Contact, FlowVersion
from app.services.telephony import normalize_e164

router = APIRouter()


class FlowCreate(BaseModel):
    name: str = "Customer call flow"
    nodes: list[dict] = Field(min_length=1, max_length=50)
    start_node_id: str | None = None


class ContactCreate(BaseModel):
    name: str | None = None
    phone_number: str
    extra_data: dict | None = None


class CampaignCreate(BaseModel):
    name: str = "Outbound call campaign"
    flow_version_id: str
    contact_ids: list[str] = Field(min_length=1, max_length=500)


async def owned_business(db: AsyncSession, agency_id: str, business_id: str) -> Business:
    result = await db.execute(
        select(Business).where(
            Business.id == business_id,
            Business.agency_id == agency_id,
            Business.active.is_(True),
        )
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.get("/businesses/{business_id}/flows")
async def list_flows(
    business_id: str,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    await owned_business(db, agency.id, business_id)
    result = await db.execute(
        select(FlowVersion).where(FlowVersion.business_id == business_id).order_by(FlowVersion.created_at.desc())
    )
    return result.scalars().all()


@router.post("/businesses/{business_id}/flows", status_code=status.HTTP_201_CREATED)
async def create_flow(
    business_id: str,
    payload: FlowCreate,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    await owned_business(db, agency.id, business_id)
    try:
        flow = normalize_flow(payload.nodes, payload.start_node_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = await db.execute(
        select(FlowVersion).where(FlowVersion.business_id == business_id).order_by(FlowVersion.version.desc())
    )
    latest = result.scalars().first()
    version = (latest.version + 1) if latest else 1
    db_flow = FlowVersion(
        business_id=business_id,
        name=payload.name,
        nodes=flow["nodes"],
        start_node_id=flow["start_node_id"],
        version=version,
        active=True,
    )
    db.add(db_flow)
    await db.flush()
    await db.execute(
        AgentConfig.__table__.update()
        .where(AgentConfig.business_id == business_id)
        .values(active_flow_version_id=db_flow.id, flow_data=flow)
    )
    await db.commit()
    await db.refresh(db_flow)
    return db_flow


@router.post("/businesses/{business_id}/contacts", status_code=status.HTTP_201_CREATED)
async def create_contact(
    business_id: str,
    payload: ContactCreate,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    await owned_business(db, agency.id, business_id)
    try:
        phone = normalize_e164(payload.phone_number)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    contact = Contact(
        business_id=business_id,
        name=payload.name,
        phone_number=phone,
        extra_data=payload.extra_data,
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.get("/businesses/{business_id}/contacts")
async def list_contacts(
    business_id: str,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    await owned_business(db, agency.id, business_id)
    result = await db.execute(
        select(Contact).where(Contact.business_id == business_id, Contact.active.is_(True)).order_by(Contact.created_at.desc())
    )
    return result.scalars().all()


@router.post("/businesses/{business_id}/campaigns", status_code=status.HTTP_201_CREATED)
async def create_campaign(
    business_id: str,
    payload: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    await owned_business(db, agency.id, business_id)
    flow_result = await db.execute(
        select(FlowVersion).where(
            FlowVersion.id == payload.flow_version_id,
            FlowVersion.business_id == business_id,
            FlowVersion.active.is_(True),
        )
    )
    flow = flow_result.scalar_one_or_none()
    if not flow:
        raise HTTPException(status_code=404, detail="Active flow not found")
    contact_result = await db.execute(
        select(Contact).where(
            Contact.business_id == business_id,
            Contact.id.in_(payload.contact_ids),
            Contact.active.is_(True),
        )
    )
    contacts = contact_result.scalars().all()
    if len(contacts) != len(set(payload.contact_ids)):
        raise HTTPException(status_code=422, detail="One or more contacts are invalid")
    campaign = Campaign(
        business_id=business_id,
        flow_version_id=flow.id,
        contact_ids=[contact.id for contact in contacts],
        name=payload.name,
        status="draft",
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return {"campaign": campaign, "contacts": contacts}


@router.post("/campaigns/{campaign_id}/start", status_code=status.HTTP_202_ACCEPTED)
async def start_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    agency: Agency = Depends(get_current_agency),
):
    """Start the MVP campaign sequentially; a queue can replace this later."""
    result = await db.execute(
        select(Campaign, Business, FlowVersion)
        .join(Business, Business.id == Campaign.business_id)
        .join(FlowVersion, FlowVersion.id == Campaign.flow_version_id)
        .where(Campaign.id == campaign_id, Business.agency_id == agency.id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign, business, flow = row
    if campaign.status == "running":
        raise HTTPException(status_code=409, detail="Campaign is already running")

    contact_ids = campaign.contact_ids or []
    if not contact_ids:
        raise HTTPException(status_code=422, detail="Campaign has no active contacts")

    campaign.status = "running"
    await db.commit()
    results = []
    from app.services.livekit_telephony import start_livekit_agent_call

    for contact_id in contact_ids:
        contact = await db.get(Contact, contact_id)
        call = Call(
            business_id=business.id,
            agency_id=business.agency_id,
            contact_id=contact.id,
            campaign_id=campaign.id,
            flow_version_id=flow.id,
            caller_number=contact.phone_number,
            telephony_provider=business.telephony_provider,
            direction="outbound",
            status="dialing",
        )
        db.add(call)
        await db.commit()
        await db.refresh(call)
        try:
            dial = await start_livekit_agent_call(
                business_id=str(business.id),
                phone_number=contact.phone_number,
                call_id=call.id,
                contact_id=contact.id,
                campaign_id=campaign.id,
                flow_version_id=flow.id,
                flow_data={"start_node_id": flow.start_node_id, "nodes": flow.nodes},
            )
            call.provider_call_id = dial.get("provider_call_id") or None
            results.append({"call_id": call.id, "contact_id": contact.id, "status": "dialing", **dial})
        except Exception as exc:
            call.status = "failed"
            call.outcome = "dial_failed"
            results.append({"call_id": call.id, "contact_id": contact.id, "status": "failed", "error": str(exc)})
        await db.commit()

    campaign.status = "completed"
    await db.commit()
    return {"campaign_id": campaign.id, "status": campaign.status, "results": results}
