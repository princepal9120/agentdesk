"""
Availability Engine
TRS Reference: Section 2.4 - Real-Time Availability Algorithm
PRD Reference: FR-2 - Real-time availability checks
"""

import json
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis

from app.models.doctor import Doctor
from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import TimeSlot
from app.core.config import settings


class AvailabilityEngine:
    """Calculate available appointment slots in real-time."""
    
    def __init__(self, db: AsyncSession, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client
    
    async def get_available_slots(
        self,
        doctor_id: UUID,
        date_from: date,
        date_to: date,
        duration_minutes: int = 30,
        use_cache: bool = True
    ) -> List[TimeSlot]:
        """
        Get available appointment slots for a doctor.
        TRS 2.4: Algorithm with 5-second Redis cache.
        """
        cache_key = f"availability:{doctor_id}:{date_from}:{date_to}:{duration_minutes}"
        
        # Check cache first
        if use_cache:
            cached = await self.redis.get(cache_key)
            if cached:
                data = json.loads(cached)
                return [TimeSlot(**slot) for slot in data]
        
        # Get doctor with working hours
        result = await self.db.execute(
            select(Doctor).where(Doctor.id == doctor_id, Doctor.is_active == True)
        )
        doctor = result.scalar_one_or_none()
        if not doctor:
            return []
        
        # Get existing appointments
        date_from_dt = datetime.combine(date_from, datetime.min.time()).replace(tzinfo=timezone.utc)
        date_to_dt = datetime.combine(date_to, datetime.max.time()).replace(tzinfo=timezone.utc)
        
        result = await self.db.execute(
            select(Appointment).where(
                Appointment.doctor_id == doctor_id,
                Appointment.start_time >= date_from_dt,
                Appointment.start_time <= date_to_dt,
                Appointment.status != AppointmentStatus.CANCELLED.value
            )
        )
        appointments = result.scalars().all()
        
        # Calculate available slots
        available_slots = []
        current_date = date_from
        
        while current_date <= date_to:
            day_slots = self._calculate_day_slots(
                current_date, doctor, appointments, duration_minutes
            )
            available_slots.extend(day_slots)
            current_date += timedelta(days=1)
        
        # Cache for 5 seconds
        await self.redis.setex(
            cache_key, settings.REDIS_AVAILABILITY_TTL,
            json.dumps([slot.model_dump(mode="json") for slot in available_slots])
        )
        
        return available_slots
    
    def _calculate_day_slots(
        self, day: date, doctor: Doctor, appointments: List[Appointment], duration: int
    ) -> List[TimeSlot]:
        """Calculate available slots for a single day."""
        day_name = day.strftime("%A").lower()
        hours = doctor.working_hours.get(day_name)
        
        if not hours or hours is None:
            return []
        
        start = datetime.combine(
            day, datetime.strptime(hours["start"], "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        end = datetime.combine(
            day, datetime.strptime(hours["end"], "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        
        # Get booked times with buffer
        booked = self._get_booked_times(appointments, doctor.buffer_time_minutes, day)
        
        slots = []
        current = start
        slot_duration = timedelta(minutes=duration)
        step = timedelta(minutes=15)  # 15-min intervals for flexibility
        
        while current + slot_duration <= end:
            is_available = not any(
                b_start <= current < b_end for b_start, b_end in booked
            )
            if is_available:
                slots.append(TimeSlot(
                    start_time=current,
                    end_time=current + slot_duration,
                    type="available"
                ))
            current += step
        
        return slots
    
    def _get_booked_times(
        self, appointments: List[Appointment], buffer: int, day: date
    ) -> List[Tuple[datetime, datetime]]:
        """Get list of booked time ranges including buffer."""
        booked = []
        buffer_td = timedelta(minutes=buffer)
        
        for apt in appointments:
            if apt.start_time.date() == day:
                start = apt.start_time - buffer_td
                end = apt.end_time + buffer_td
                booked.append((start, end))
        
        return booked
