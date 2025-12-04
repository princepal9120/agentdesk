"""
Patient Router
TRS Reference: Section 2.3.1 - Patients Table
PRD Reference: FR-3 - Patient Data Management
"""

from typing import Optional
from uuid import UUID
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.services.patient_service import PatientService

router = APIRouter(prefix="/patients", tags=["Patients"])


class PatientCreate(BaseModel):
    """Create patient request."""
    user_id: UUID
    date_of_birth: date
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact: Optional[str] = None


class PatientUpdate(BaseModel):
    """Update patient request."""
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    sms_consent: Optional[bool] = None
    email_consent: Optional[bool] = None
    call_consent: Optional[bool] = None


class PatientResponse(BaseModel):
    """Patient response model (PHI encrypted)."""
    id: UUID
    date_of_birth: date
    preferred_contact_method: str
    sms_consent: bool
    email_consent: bool
    call_consent: bool

    class Config:
        from_attributes = True


@router.post("", status_code=201)
async def create_patient(
    data: PatientCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new patient profile."""
    service = PatientService(db)
    
    patient = await service.create_patient(
        user_id=data.user_id,
        date_of_birth=data.date_of_birth,
        medical_history=data.medical_history,
        allergies=data.allergies,
        emergency_contact=data.emergency_contact,
        created_by=current_user.id
    )
    
    return {"patient_id": patient.id, "message": "Patient created"}


@router.get("/me", response_model=PatientResponse)
async def get_current_patient(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's patient profile."""
    service = PatientService(db)
    
    patient = await service.get_patient_by_user(
        current_user.id, accessed_by=current_user.id
    )
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    
    return PatientResponse.model_validate(patient)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get patient by ID."""
    service = PatientService(db)
    
    # Authorization check
    if current_user.role == UserRole.PATIENT:
        own_patient = await service.get_patient_by_user(current_user.id)
        if not own_patient or own_patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    patient = await service.get_patient(
        patient_id, accessed_by=current_user.id
    )
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return PatientResponse.model_validate(patient)


@router.put("/{patient_id}")
async def update_patient(
    patient_id: UUID,
    data: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update patient profile."""
    service = PatientService(db)
    
    # Authorization check
    if current_user.role == UserRole.PATIENT:
        own_patient = await service.get_patient_by_user(current_user.id)
        if not own_patient or own_patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    patient = await service.update_patient(
        patient_id,
        updated_by=current_user.id,
        **data.model_dump(exclude_unset=True)
    )
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return {"message": "Patient updated"}
