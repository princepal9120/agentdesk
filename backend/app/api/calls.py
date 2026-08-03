"""
Call log endpoints — list calls, get transcripts, get stats.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.api.deps import get_current_agency
from app.core.database import get_db
from app.models.agency import Agency
from app.models.call import Call, Booking, FlowVersion, Contact
from app.models.business import Business

router = APIRouter()


class CallOut(BaseModel):
    id: str
    business_id: str
    twilio_call_sid: str | None
    caller_number: str | None
    duration_sec: int | None
    status: str
    outcome: str | None
    summary: str | None
    started_at: datetime
    ended_at: datetime | None

    class Config:
        from_attributes = True


class TranscriptOut(BaseModel):
    call_id: str
    transcript: list | None
    duration_sec: int | None
    outcome: str | None
    summary: str | None


class CallStatsOut(BaseModel):
    total_calls: int
    answered_calls: int
    bookings_made: int
    avg_duration_sec: float
    period: str


class OutboundCallRequest(BaseModel):
    business_id: str
    phone_number: str
    reminder_text: str = "This is a reminder from your business. How can I help you today?"
    flow_version_id: str | None = None
    contact_id: str | None = None


class OutboundCallOut(BaseModel):
    call_id: str
    provider: str
    room_name: str
    participant_identity: str
    provider_call_id: str


@router.post("/outbound", response_model=OutboundCallOut, status_code=202)
async def start_outbound_agent_call(
    payload: OutboundCallRequest,
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    """Start an AI reminder call through the configured Exotel SIP trunk."""

    result = await db.execute(
        select(Business).where(
            Business.id == payload.business_id,
            Business.agency_id == current_agency.id,
            Business.active == True,
        )
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    from app.services.livekit_telephony import start_livekit_agent_call

    local_call_id: str | None = None
    try:
        flow = None
        if payload.flow_version_id:
            flow_result = await db.execute(
                select(FlowVersion).where(
                    FlowVersion.id == payload.flow_version_id,
                    FlowVersion.business_id == business.id,
                    FlowVersion.active.is_(True),
                )
            )
            flow = flow_result.scalar_one_or_none()
            if not flow:
                raise HTTPException(status_code=404, detail="Flow not found")

        contact = None
        if payload.contact_id:
            contact = await db.get(Contact, payload.contact_id)
            if not contact or contact.business_id != business.id:
                raise HTTPException(status_code=404, detail="Contact not found")

        local_call = Call(
            business_id=business.id,
            agency_id=business.agency_id,
            contact_id=contact.id if contact else None,
            flow_version_id=flow.id if flow else None,
            caller_number=payload.phone_number,
            telephony_provider=business.telephony_provider,
            direction="outbound",
            status="dialing",
        )
        db.add(local_call)
        await db.commit()
        await db.refresh(local_call)
        local_call_id = local_call.id
        dial = await start_livekit_agent_call(
            business_id=str(business.id),
            phone_number=payload.phone_number,
            reminder_text=payload.reminder_text,
            call_id=local_call_id,
            contact_id=contact.id if contact else None,
            flow_version_id=flow.id if flow else None,
            flow_data=(
                {"start_node_id": flow.start_node_id, "nodes": flow.nodes}
                if flow
                else None
            ),
        )
    except ValueError as exc:
        if local_call_id:
            failed = await db.get(Call, local_call_id)
            if failed:
                failed.status = "failed"
                failed.outcome = "invalid_request"
                await db.commit()
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        if local_call_id:
            failed = await db.get(Call, local_call_id)
            if failed:
                failed.status = "failed"
                failed.outcome = "dial_failed"
                await db.commit()
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    # The local call row was created before dialing; attach the provider id now.
    saved_call = await db.get(Call, local_call_id)
    if saved_call:
        saved_call.provider_call_id = dial.get("provider_call_id") or None
        await db.commit()
    return {"call_id": local_call_id, "provider": "exotel-livekit", **dial}


@router.get("/", response_model=list[CallOut])
async def list_calls(
    business_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    query = select(Call).where(Call.agency_id == current_agency.id)
    if business_id is not None:
        query = query.where(Call.business_id == business_id)

    result = await db.execute(
        query.order_by(desc(Call.started_at)).limit(limit).offset(offset)
    )
    return result.scalars().all()


@router.get("/{call_id}/transcript", response_model=TranscriptOut)
async def get_transcript(
    call_id: str,
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    result = await db.execute(
        select(Call).where(Call.id == call_id, Call.agency_id == current_agency.id)
    )
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return {
        "call_id": call.id,
        "transcript": call.transcript,
        "duration_sec": call.duration_sec,
        "outcome": call.outcome,
        "summary": call.summary,
    }


@router.get("/business/{business_id}/stats", response_model=CallStatsOut)
async def get_call_stats(
    business_id: str,
    period: str = "month",  # week|month|all
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    from datetime import timedelta

    now = datetime.utcnow()
    if period == "week":
        since = now - timedelta(days=7)
    elif period == "month":
        since = now - timedelta(days=30)
    else:
        since = datetime(2020, 1, 1)

    # Total + answered
    total_result = await db.execute(
        select(func.count()).where(
            Call.agency_id == current_agency.id,
            Call.business_id == business_id,
            Call.started_at >= since,
        )
    )
    total = total_result.scalar() or 0

    answered_result = await db.execute(
        select(func.count()).where(
            Call.agency_id == current_agency.id,
            Call.business_id == business_id,
            Call.started_at >= since,
            Call.status == "answered",
        )
    )
    answered = answered_result.scalar() or 0

    # Bookings
    bookings_result = await db.execute(
        select(func.count()).select_from(Booking, Call).where(
            Booking.business_id == business_id,
            Booking.call_id == Call.id,
            Call.agency_id == current_agency.id,
            Booking.created_at >= since,
        )
    )
    bookings = bookings_result.scalar() or 0

    # Avg duration
    avg_result = await db.execute(
        select(func.avg(Call.duration_sec)).where(
            Call.agency_id == current_agency.id,
            Call.business_id == business_id,
            Call.started_at >= since,
            Call.duration_sec.isnot(None),
        )
    )
    avg_duration = float(avg_result.scalar() or 0)

    return {
        "total_calls": total,
        "answered_calls": answered,
        "bookings_made": bookings,
        "avg_duration_sec": avg_duration,
        "period": period,
    }
