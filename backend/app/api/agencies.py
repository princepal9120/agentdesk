"""
Agency CRUD for OSS/local deployment.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import uuid

from app.api.deps import get_current_agency
from app.core.database import get_db
from app.models.agency import Agency

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class AgencyCreate(BaseModel):
    name: str
    subdomain: str | None = None


class AgencyUpdate(BaseModel):
    name: str | None = None
    subdomain: str | None = None
    custom_domain: str | None = None
    branding: dict | None = None


class AgencyOut(BaseModel):
    id: uuid.UUID
    clerk_org_id: str | None
    name: str
    subdomain: str | None
    custom_domain: str | None
    branding: dict | None
    plan: str
    client_limit: int
    monthly_call_limit: int

    class Config:
        from_attributes = True


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", response_model=AgencyOut, status_code=status.HTTP_201_CREATED)
async def create_agency(payload: AgencyCreate, db: AsyncSession = Depends(get_db)):
    """Create an agency record for self-hosted setups."""
    if payload.subdomain:
        existing = await db.execute(
            select(Agency).where(Agency.subdomain == payload.subdomain)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Agency already exists for this subdomain")

    agency = Agency(**payload.model_dump())
    db.add(agency)
    await db.commit()
    await db.refresh(agency)
    return agency


@router.get("/me", response_model=AgencyOut)
async def get_me(agency: Agency = Depends(get_current_agency)):
    return agency


@router.get("/{agency_id}", response_model=AgencyOut)
async def get_agency(agency_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency = result.scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    return agency


@router.patch("/{agency_id}", response_model=AgencyOut)
async def update_agency(
    agency_id: uuid.UUID, payload: AgencyUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency = result.scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(agency, field, value)

    await db.commit()
    await db.refresh(agency)
    return agency
