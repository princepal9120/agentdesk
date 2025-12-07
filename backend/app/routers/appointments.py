"""
Appointment Router
TRS Reference: Section 2.2.2 - Appointment Endpoints
PRD Reference: FR-2 - Appointment Management
"""

from datetime import date
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.core.database import get_db
from app.core.redis import get_redis
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.appointment import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse,
    AppointmentCreateResponse, AppointmentListResponse,
    AvailabilityResponse
)
from app.schemas.auth import MessageResponse
from app.services.appointment_service import AppointmentService
from app.services.availability_service import AvailabilityEngine

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=AppointmentListResponse)
async def list_appointments(
    patient_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List appointments with optional filters.
    TRS 2.2.2: GET /api/v1/appointments
    Authorization: Patient (self) or Doctor (their patients) or Admin
    """
    service = AppointmentService(db)
    
    # Authorization: patients can only see their own, doctors can only see their own
    doctor_id_filter = None
    if current_user.role == UserRole.PATIENT:
        if current_user.patient:
            patient_id = current_user.patient.id
        else:
            return AppointmentListResponse(total=0, appointments=[], has_more=False)
    elif current_user.role == UserRole.DOCTOR:
        if current_user.doctor:
            doctor_id_filter = current_user.doctor.id
        else:
            return AppointmentListResponse(total=0, appointments=[], has_more=False)
    
    # Note: If admin, no forced filters apply (can verify all)

    appointments, total, has_more = await service.get_appointments(
        patient_id=patient_id, 
        doctor_id=doctor_id_filter,
        status=status, 
        limit=limit, 
        offset=offset
    )
    
    return AppointmentListResponse(
        total=total,
        appointments=[AppointmentResponse.model_validate(a) for a in appointments],
        has_more=has_more
    )


@router.post("", response_model=AppointmentCreateResponse, status_code=201)
async def create_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new appointment.
    TRS 2.2.2: POST /api/v1/appointments
    """
    service = AppointmentService(db)
    
    try:
        appointment, reminder_scheduled = await service.create_appointment(
            data, created_by=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return AppointmentCreateResponse(
        appointment_id=appointment.id,
        confirmation_code=appointment.confirmation_code,
        start_time=appointment.start_time,
        reminder_scheduled=reminder_scheduled
    )


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get appointment by ID."""
    service = AppointmentService(db)
    appointment = await service.get_appointment(appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Authorization check
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient or current_user.patient.id != appointment.patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return AppointmentResponse.model_validate(appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: UUID,
    data: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update an appointment.
    TRS 2.2.2: PUT /api/v1/appointments/{id}
    """
    service = AppointmentService(db)
    appointment = await service.update_appointment(
        appointment_id, data, updated_by=current_user.id
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return AppointmentResponse.model_validate(appointment)


@router.delete("/{appointment_id}", response_model=MessageResponse)
async def cancel_appointment(
    appointment_id: UUID,
    reason: Optional[str] = Query(None),
    notify: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancel an appointment.
    TRS 2.2.2: DELETE /api/v1/appointments/{id}
    """
    service = AppointmentService(db)
    initiator = "patient" if current_user.role == UserRole.PATIENT else "staff"
    
    appointment = await service.cancel_appointment(
        appointment_id, reason=reason, initiator=initiator,
        cancelled_by=current_user.id
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found or cannot be cancelled")
    
    # TODO: Send cancellation notification if notify=True
    
    return MessageResponse(message="Cancelled")


# Availability endpoint (on doctors router, but included here for completeness)
availability_router = APIRouter(prefix="/doctors", tags=["Doctors"])


@availability_router.get("/{doctor_id}/availability", response_model=AvailabilityResponse)
async def get_doctor_availability(
    doctor_id: UUID,
    date_from: date = Query(...),
    date_to: date = Query(...),
    duration: int = Query(30, ge=15, le=120),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Get doctor availability.
    TRS 2.2.2: GET /api/v1/doctors/{id}/availability
    Cache: 5-second TTL in Redis
    """
    engine = AvailabilityEngine(db, redis_client)
    slots = await engine.get_available_slots(
        doctor_id, date_from, date_to, duration
    )
    
    return AvailabilityResponse(available_slots=slots)
