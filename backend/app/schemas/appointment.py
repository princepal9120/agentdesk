"""
Appointment Schemas
TRS Reference: Section 2.2.2 - Appointment Endpoints
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field


class AppointmentCreate(BaseModel):
    """POST /api/v1/appointments request body."""
    doctor_id: UUID
    patient_id: UUID
    start_time: datetime
    duration_minutes: int = Field(default=30, ge=15, le=120)
    reason: Optional[str] = None
    appointment_type: str = "general"
    is_virtual: bool = False


class AppointmentUpdate(BaseModel):
    """PUT /api/v1/appointments/{id} request body."""
    start_time: Optional[datetime] = None
    doctor_id: Optional[UUID] = None
    status: Optional[str] = None
    reason_for_visit: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    """Appointment response model."""
    id: UUID
    patient_id: UUID
    doctor_id: UUID
    start_time: datetime
    end_time: datetime
    status: str
    appointment_type: str
    confirmation_code: str
    reason_for_visit: Optional[str] = None
    is_virtual: bool
    confirmed_by_patient: bool
    confirmed_by_doctor: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AppointmentCreateResponse(BaseModel):
    """POST /api/v1/appointments response."""
    appointment_id: UUID
    confirmation_code: str
    start_time: datetime
    reminder_scheduled: bool


class AppointmentListResponse(BaseModel):
    """GET /api/v1/appointments response."""
    total: int
    appointments: List[AppointmentResponse]
    has_more: bool


class TimeSlot(BaseModel):
    """Available time slot."""
    start_time: datetime
    end_time: datetime
    type: str = "available"


class AvailabilityResponse(BaseModel):
    """GET /api/v1/doctors/{id}/availability response."""
    available_slots: List[TimeSlot]
