"""
Availability Service Tests
TRS Reference: Section 2.4 - Real-Time Availability Algorithm
PRD Reference: FR-2 - Real-time availability checks
"""

import pytest
from datetime import date, datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock

from app.services.availability_service import AvailabilityEngine
from app.models.doctor import Doctor, DEFAULT_WORKING_HOURS
from app.models.appointment import Appointment, AppointmentStatus


class TestAvailabilityEngine:
    """Test availability algorithm per TRS 2.4."""
    
    def test_calculate_day_slots_empty_day(self):
        """Test slot calculation for empty day."""
        engine = AvailabilityEngine(MagicMock(), MagicMock())
        
        # Create mock doctor
        doctor = MagicMock()
        doctor.working_hours = DEFAULT_WORKING_HOURS
        doctor.buffer_time_minutes = 15
        
        # Monday = working day
        test_date = date(2024, 12, 2)  # A Monday
        
        slots = engine._calculate_day_slots(
            test_date,
            doctor,
            [],  # No appointments
            30   # 30-min slots
        )
        
        # Should have multiple slots
        assert len(slots) > 0
        
        # First slot should start at 09:00
        first_slot = slots[0]
        assert first_slot.start_time.hour == 9
        assert first_slot.start_time.minute == 0
    
    def test_calculate_day_slots_weekend(self):
        """Test no slots on weekend (non-working day)."""
        engine = AvailabilityEngine(MagicMock(), MagicMock())
        
        doctor = MagicMock()
        doctor.working_hours = DEFAULT_WORKING_HOURS
        doctor.buffer_time_minutes = 15
        
        # Saturday = non-working day
        test_date = date(2024, 12, 7)  # A Saturday
        
        slots = engine._calculate_day_slots(
            test_date,
            doctor,
            [],
            30
        )
        
        # Should have no slots
        assert len(slots) == 0
    
    def test_calculate_day_slots_with_appointment(self):
        """Test slots blocked by existing appointment."""
        engine = AvailabilityEngine(MagicMock(), MagicMock())
        
        doctor = MagicMock()
        doctor.working_hours = DEFAULT_WORKING_HOURS
        doctor.buffer_time_minutes = 15
        
        test_date = date(2024, 12, 2)  # Monday
        
        # Create existing appointment at 10:00-10:30
        existing_apt = MagicMock()
        existing_apt.start_time = datetime.combine(
            test_date, 
            datetime.strptime("10:00", "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        existing_apt.end_time = datetime.combine(
            test_date,
            datetime.strptime("10:30", "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        
        slots = engine._calculate_day_slots(
            test_date,
            doctor,
            [existing_apt],
            30
        )
        
        # 10:00 slot should not be available
        slot_times = [s.start_time.strftime("%H:%M") for s in slots]
        assert "10:00" not in slot_times
    
    def test_get_booked_times_with_buffer(self):
        """Test booked times include buffer."""
        engine = AvailabilityEngine(MagicMock(), MagicMock())
        
        test_date = date(2024, 12, 2)
        
        apt = MagicMock()
        apt.start_time = datetime.combine(
            test_date,
            datetime.strptime("10:00", "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        apt.end_time = datetime.combine(
            test_date,
            datetime.strptime("10:30", "%H:%M").time()
        ).replace(tzinfo=timezone.utc)
        
        booked = engine._get_booked_times([apt], 15, test_date)
        
        assert len(booked) == 1
        start, end = booked[0]
        
        # Start should be 15 min before appointment
        assert start.hour == 9
        assert start.minute == 45
        
        # End should be 15 min after appointment
        assert end.hour == 10
        assert end.minute == 45


class TestAvailabilityCaching:
    """Test Redis caching per TRS 2.4."""
    
    @pytest.mark.asyncio
    async def test_cache_hit(self):
        """Test cache returns cached result."""
        mock_db = AsyncMock()
        mock_redis = AsyncMock()
        
        # Simulate cache hit
        cached_data = '[{"start_time": "2024-12-02T09:00:00+00:00", "end_time": "2024-12-02T09:30:00+00:00", "type": "available"}]'
        mock_redis.get.return_value = cached_data
        
        engine = AvailabilityEngine(mock_db, mock_redis)
        
        from uuid import uuid4
        slots = await engine.get_available_slots(
            uuid4(),
            date(2024, 12, 2),
            date(2024, 12, 2),
            30,
            use_cache=True
        )
        
        # Should return from cache
        assert len(slots) == 1
        
        # DB should not be called
        mock_db.execute.assert_not_called()
