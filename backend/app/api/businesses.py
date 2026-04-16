"""
Business (client) management — create and configure clients for an agency.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
import uuid

from app.core.database import get_db
from app.models.agency import Agency
from app.models.business import Business, AgentConfig
from agent.templates import get_template, render_system_prompt
from app.api.deps import get_current_agency

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class BusinessCreate(BaseModel):
    name: str
    vertical: str = "general"  # salon|restaurant|repair|general
    timezone: str = "America/New_York"


class AgentConfigUpdate(BaseModel):
    agent_name: str | None = None
    voice_id: str | None = None
    business_hours: dict | None = None
    services: list | None = None
    faq: list | None = None
    system_prompt_override: str | None = None  # Custom prompt (Pro feature)


class BusinessOut(BaseModel):
    id: uuid.UUID
    agency_id: uuid.UUID
    name: str
    vertical: str | None
    phone_number: str | None
    timezone: str
    active: bool
    has_config: bool

    class Config:
        from_attributes = True


class AgentConfigOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    template: str
    agent_name: str
    voice_id: str
    system_prompt: str
    business_hours: dict | None
    services: list | None
    faq: list | None

    class Config:
        from_attributes = True


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", response_model=BusinessOut, status_code=status.HTTP_201_CREATED)
async def create_business(
    payload: BusinessCreate,
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    """Add a new client business for the current agency."""

    # Count existing clients
    count_result = await db.execute(
        select(func.count()).where(
            Business.agency_id == current_agency.id,
            Business.active == True,
        )
    )
    current_count = count_result.scalar()

    if current_count >= current_agency.client_limit:
        raise HTTPException(
            status_code=402,
            detail=f"Plan limit reached ({current_count}/{current_agency.client_limit} clients). Upgrade to add more."
        )

    business = Business(**payload.model_dump(), agency_id=current_agency.id)
    db.add(business)
    await db.flush()  # Get ID without committing

    # Auto-create default agent config from template
    template = get_template(payload.vertical)
    system_prompt = render_system_prompt(template, {
        "agent_name": template.default_agent_name,
        "business_name": payload.name,
        "business_hours": None,
        "services": [],
        "faq": [],
    })

    config = AgentConfig(
        business_id=business.id,
        template=payload.vertical,
        agent_name=template.default_agent_name,
        system_prompt=system_prompt,
    )
    db.add(config)
    await db.commit()
    await db.refresh(business)

    return {**business.__dict__, "has_config": True}


@router.get("/", response_model=list[BusinessOut])
async def list_businesses(
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    result = await db.execute(
        select(Business).where(Business.agency_id == current_agency.id, Business.active == True)
    )
    businesses = result.scalars().all()

    out = []
    for b in businesses:
        config_result = await db.execute(
            select(AgentConfig).where(AgentConfig.business_id == b.id)
        )
        has_config = config_result.scalar_one_or_none() is not None
        out.append({**b.__dict__, "has_config": has_config})
    return out


@router.get("/{business_id}", response_model=BusinessOut)
async def get_business(
    business_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_agency: Agency = Depends(get_current_agency),
):
    result = await db.execute(
        select(Business).where(
            Business.id == business_id,
            Business.agency_id == current_agency.id,
            Business.active == True,
        )
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    config_result = await db.execute(
        select(AgentConfig).where(AgentConfig.business_id == business.id)
    )
    has_config = config_result.scalar_one_or_none() is not None
    return {**business.__dict__, "has_config": has_config}


@router.get("/{business_id}/config", response_model=AgentConfigOut)
async def get_agent_config(business_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AgentConfig).where(AgentConfig.business_id == business_id)
    )
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")
    return config


@router.patch("/{business_id}/config", response_model=AgentConfigOut)
async def update_agent_config(
    business_id: uuid.UUID,
    payload: AgentConfigUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update agent config and regenerate system prompt."""

    # Load business + config
    biz_result = await db.execute(select(Business).where(Business.id == business_id))
    business = biz_result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    cfg_result = await db.execute(
        select(AgentConfig).where(AgentConfig.business_id == business_id)
    )
    config = cfg_result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")

    # Apply updates
    update_data = payload.model_dump(exclude_none=True)
    custom_prompt = update_data.pop("system_prompt_override", None)

    for field, value in update_data.items():
        setattr(config, field, value)

    # Regenerate system prompt unless overridden
    if custom_prompt:
        config.system_prompt = custom_prompt
    else:
        template = get_template(config.template)
        config.system_prompt = render_system_prompt(template, {
            "agent_name": config.agent_name,
            "business_name": business.name,
            "phone_number": business.phone_number or "",
            "business_hours": config.business_hours,
            "services": config.services or [],
            "faq": config.faq or [],
        })

    await db.commit()
    await db.refresh(config)
    return config


@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_business(business_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Soft-delete a client business."""
    result = await db.execute(select(Business).where(Business.id == business_id))
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    business.active = False
    await db.commit()
