"""
Doctor Router
TRS Reference: Section 2.3.1 - Doctors Table
PRD Reference: Section 3.3 - Doctor/Clinic Features
"""

from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.services.doctor_service import DoctorService

router = APIRouter(prefix="/doctors", tags=["Doctors"])


class DoctorResponse(BaseModel):
    """Doctor response model."""
    id: UUID
    first_name: str
    last_name: str
    specialization: str
    is_active: bool

    class Config:
        from_attributes = True


class DoctorListResponse(BaseModel):
    """List doctors response."""
    doctors: List[DoctorResponse]


class WorkingHoursUpdate(BaseModel):
    """Update working hours request."""
    working_hours: dict


@router.get("", response_model=DoctorListResponse)
async def list_doctors(
    specialization: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    List all active doctors.
    TRS 4.3: list_doctors tool
    """
    service = DoctorService(db)
    doctors = await service.list_doctors(
        specialization=specialization,
        limit=limit,
        offset=offset
    )
    
    return DoctorListResponse(
        doctors=[DoctorResponse.model_validate(d) for d in doctors]
    )


@router.get("/specializations", response_model=List[str])
async def get_specializations(
    db: AsyncSession = Depends(get_db)
):
    """Get list of available specializations."""
    service = DoctorService(db)
    return await service.get_specializations()


@router.get("/{doctor_id}", response_model=DoctorResponse)
async def get_doctor(
    doctor_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get doctor by ID."""
    service = DoctorService(db)
    doctor = await service.get_doctor(doctor_id)
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return DoctorResponse.model_validate(doctor)


@router.put("/{doctor_id}/working-hours")
async def update_working_hours(
    doctor_id: UUID,
    data: WorkingHoursUpdate,
    current_user: User = Depends(require_roles(UserRole.DOCTOR, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Update doctor's working hours."""
    service = DoctorService(db)
    
    # Verify doctor owns this profile or is admin
    if current_user.role == UserRole.DOCTOR:
        doctor = await service.get_doctor_by_user(current_user.id)
        if not doctor or doctor.id != doctor_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    doctor = await service.update_working_hours(
        doctor_id, data.working_hours, current_user.id
    )
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return {"message": "Working hours updated"}
