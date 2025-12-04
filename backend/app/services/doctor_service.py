"""
Doctor Service
TRS Reference: Section 2.3.1 - Doctors Table
PRD Reference: Section 3.3 - Doctor/Clinic Features
"""

from typing import Optional, List, Dict, Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.doctor import Doctor
from app.services.audit_service import log_phi_access


class DoctorService:
    """Service for doctor management."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_doctor(self, doctor_id: UUID) -> Optional[Doctor]:
        """Get doctor by ID."""
        return await self.db.get(Doctor, doctor_id)
    
    async def get_doctor_by_user(self, user_id: UUID) -> Optional[Doctor]:
        """Get doctor by user ID."""
        result = await self.db.execute(
            select(Doctor).where(Doctor.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def list_doctors(
        self,
        specialization: Optional[str] = None,
        clinic_id: Optional[UUID] = None,
        is_active: bool = True,
        limit: int = 50,
        offset: int = 0
    ) -> List[Doctor]:
        """List doctors with optional filters."""
        query = select(Doctor).where(Doctor.is_active == is_active)
        
        if specialization:
            query = query.where(Doctor.specialization.ilike(f"%{specialization}%"))
        if clinic_id:
            query = query.where(Doctor.clinic_id == clinic_id)
        
        query = query.order_by(Doctor.last_name).limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def update_working_hours(
        self,
        doctor_id: UUID,
        working_hours: Dict[str, Any],
        updated_by: Optional[UUID] = None
    ) -> Optional[Doctor]:
        """Update doctor's working hours."""
        doctor = await self.db.get(Doctor, doctor_id)
        if not doctor:
            return None
        
        old_hours = doctor.working_hours
        doctor.working_hours = working_hours
        
        await self.db.flush()
        
        await log_phi_access(
            self.db, updated_by, "update", "doctor",
            doctor_id, old_values={"working_hours": old_hours},
            new_values={"working_hours": working_hours}, contains_phi=False
        )
        
        return doctor
    
    async def update_buffer_time(
        self,
        doctor_id: UUID,
        buffer_minutes: int,
        updated_by: Optional[UUID] = None
    ) -> Optional[Doctor]:
        """Update buffer time between appointments."""
        doctor = await self.db.get(Doctor, doctor_id)
        if not doctor:
            return None
        
        doctor.buffer_time_minutes = buffer_minutes
        await self.db.flush()
        return doctor
    
    async def set_inactive(
        self,
        doctor_id: UUID,
        updated_by: Optional[UUID] = None
    ) -> Optional[Doctor]:
        """Set doctor as inactive (not accepting appointments)."""
        doctor = await self.db.get(Doctor, doctor_id)
        if not doctor:
            return None
        
        doctor.is_active = False
        await self.db.flush()
        
        await log_phi_access(
            self.db, updated_by, "deactivate", "doctor",
            doctor_id, contains_phi=False
        )
        
        return doctor
    
    async def get_specializations(self) -> List[str]:
        """Get list of unique specializations."""
        result = await self.db.execute(
            select(Doctor.specialization)
            .where(Doctor.is_active == True)
            .distinct()
            .order_by(Doctor.specialization)
        )
        return [row[0] for row in result.all()]
