"""
Appointment Service
TRS Reference: Section 2.2.2 - Appointment Endpoints
PRD Reference: FR-2 - Appointment Management
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, List, Tuple
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from app.models.appointment import Appointment, AppointmentStatus
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.core.security import generate_confirmation_code
from app.services.audit_service import log_phi_access


class AppointmentService:
    """Service for appointment CRUD operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_appointment(
        self, data: AppointmentCreate, created_by: Optional[UUID] = None
    ) -> Tuple[Appointment, bool]:
        """
        Create a new appointment.
        Returns (appointment, reminder_scheduled).
        """
        # Verify patient exists
        patient = await self.db.get(Patient, data.patient_id)
        if not patient:
            raise ValueError("Patient not found")
        
        # Verify doctor exists and is active
        doctor = await self.db.get(Doctor, data.doctor_id)
        if not doctor or not doctor.is_active:
            raise ValueError("Doctor not found or inactive")
        
        # Calculate end time
        end_time = data.start_time + timedelta(minutes=data.duration_minutes)
        
        # Create appointment
        appointment = Appointment(
            patient_id=data.patient_id,
            doctor_id=data.doctor_id,
            start_time=data.start_time,
            end_time=end_time,
            status=AppointmentStatus.SCHEDULED.value,
            appointment_type=data.appointment_type,
            reason_for_visit=data.reason,
            is_virtual=data.is_virtual,
            confirmation_code=generate_confirmation_code(),
            created_by=created_by
        )
        
        try:
            self.db.add(appointment)
            await self.db.flush()
        except IntegrityError:
            await self.db.rollback()
            raise ValueError("Time slot not available (double-booking)")
        
        # Log PHI access
        await log_phi_access(
            self.db, created_by, "create", "appointment",
            appointment.id, new_values={"patient_id": str(data.patient_id)}
        )
        
        # TODO: Schedule reminders via notification service
        reminder_scheduled = True
        
        return appointment, reminder_scheduled
    
    async def get_appointment(self, appointment_id: UUID) -> Optional[Appointment]:
        """Get appointment by ID."""
        query = select(Appointment).where(Appointment.id == appointment_id).options(
            selectinload(Appointment.doctor),
            selectinload(Appointment.patient)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_appointments(
        self,
        patient_id: Optional[UUID] = None,
        doctor_id: Optional[UUID] = None,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> Tuple[List[Appointment], int, bool]:
        """
        Get appointments with filters.
        Returns (appointments, total_count, has_more).
        """
        query = select(Appointment)
        
        filters = []
        if patient_id:
            filters.append(Appointment.patient_id == patient_id)
        if doctor_id:
            filters.append(Appointment.doctor_id == doctor_id)
        if status:
            filters.append(Appointment.status == status)
        
        if filters:
            query = query.where(and_(*filters))
        
        # Get total count
        count_result = await self.db.execute(
            select(Appointment.id).where(and_(*filters)) if filters else select(Appointment.id)
        )
        total = len(count_result.all())
        
        # Get paginated results
        query = query.order_by(Appointment.start_time.desc())
        query = query.options(
            selectinload(Appointment.doctor),
            selectinload(Appointment.patient)
        )
        query = query.limit(limit + 1).offset(offset)
        
        result = await self.db.execute(query)
        appointments = list(result.scalars().all())
        
        has_more = len(appointments) > limit
        if has_more:
            appointments = appointments[:limit]
        
        return appointments, total, has_more
    
    async def update_appointment(
        self, appointment_id: UUID, data: AppointmentUpdate, updated_by: Optional[UUID] = None
    ) -> Optional[Appointment]:
        """Update an appointment."""
        appointment = await self.db.get(Appointment, appointment_id)
        if not appointment:
            return None
        
        old_values = {"status": appointment.status, "start_time": str(appointment.start_time)}
        
        if data.start_time:
            # Ensure timezone compatibility for both start and end times
            if data.start_time.tzinfo:
                if appointment.end_time.tzinfo is None:
                    appointment.end_time = appointment.end_time.replace(tzinfo=timezone.utc)
                if appointment.start_time.tzinfo is None:
                    appointment.start_time = appointment.start_time.replace(tzinfo=timezone.utc)
            elif data.start_time.tzinfo is None:
                if appointment.end_time.tzinfo:
                    appointment.end_time = appointment.end_time.replace(tzinfo=None)
                if appointment.start_time.tzinfo:
                    appointment.start_time = appointment.start_time.replace(tzinfo=None)
                
            # Calculate duration before updating start_time
            current_duration = appointment.end_time - appointment.start_time
            
            appointment.start_time = data.start_time
            appointment.end_time = data.start_time + current_duration
        if data.status:
            appointment.status = data.status
        if data.reason_for_visit:
            appointment.reason_for_visit = data.reason_for_visit
        if data.notes:
            appointment.notes = data.notes
        
        appointment.updated_at = datetime.now(timezone.utc)
        
        await log_phi_access(
            self.db, updated_by, "update", "appointment",
            appointment_id, old_values=old_values,
            new_values={"status": appointment.status}
        )
        
        await self.db.flush()
        return appointment
    
    async def cancel_appointment(
        self, appointment_id: UUID, reason: Optional[str] = None,
        initiator: str = "patient", cancelled_by: Optional[UUID] = None
    ) -> Optional[Appointment]:
        """Cancel an appointment."""
        appointment = await self.db.get(Appointment, appointment_id)
        if not appointment or not appointment.is_cancellable:
            return None
        
        appointment.status = AppointmentStatus.CANCELLED.value
        appointment.cancelled_at = datetime.now(timezone.utc)
        appointment.cancellation_reason = reason
        appointment.cancellation_initiator = initiator
        
        await log_phi_access(
            self.db, cancelled_by, "cancel", "appointment",
            appointment_id, new_values={"reason": reason}
        )
        
        await self.db.flush()
        return appointment
