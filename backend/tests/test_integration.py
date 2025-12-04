"""
Integration Tests
TRS Reference: Section 7.1 - Test Coverage
PRD Reference: End-to-end flow testing
"""

import pytest
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from httpx import AsyncClient

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.doctor import Doctor, DEFAULT_WORKING_HOURS
from app.models.appointment import Appointment
from app.core.security import hash_password, create_access_token


class TestAppointmentBookingFlow:
    """
    E2E test for complete appointment booking flow.
    PRD US-1: Patient Books Appointment
    """
    
    @pytest.mark.asyncio
    async def test_complete_booking_flow(self, client: AsyncClient, test_db):
        """Test complete patient registration -> booking -> confirmation flow."""
        
        # Step 1: Register new patient
        register_response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newpatient@example.com",
                "phone": "+15551112222",
                "password": "securepass123",
                "full_name": "New Patient"
            }
        )
        
        assert register_response.status_code == 201
        token = register_response.json()["token"]
        user_id = register_response.json()["user_id"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 2: Create patient profile (would be done by admin normally)
        # For testing, we create directly in DB
        from datetime import date
        user = await test_db.get(User, user_id)
        patient = Patient(
            user_id=user.id,
            date_of_birth=date(1990, 5, 15),
            sms_consent=True,
            email_consent=True
        )
        test_db.add(patient)
        
        # Create a doctor
        doc_user = User(
            email="doctor@example.com",
            phone_number="+15553334444",
            password_hash=hash_password("docpass123"),
            full_name="Dr. Test",
            role=UserRole.DOCTOR
        )
        test_db.add(doc_user)
        await test_db.flush()
        
        doctor = Doctor(
            user_id=doc_user.id,
            first_name="Test",
            last_name="Doctor",
            specialization="General Medicine",
            license_number="LIC789",
            phone_number="+15553334444",
            working_hours=DEFAULT_WORKING_HOURS,
            is_active=True
        )
        test_db.add(doctor)
        await test_db.flush()
        
        # Step 3: Check doctor availability
        tomorrow = (datetime.now(timezone.utc) + timedelta(days=1)).date()
        
        availability_response = await client.get(
            f"/api/v1/doctors/{doctor.id}/availability",
            params={
                "date_from": tomorrow.isoformat(),
                "date_to": tomorrow.isoformat(),
                "duration": 30
            }
        )
        
        assert availability_response.status_code == 200
        slots = availability_response.json()["available_slots"]
        assert len(slots) > 0
        
        # Step 4: Book an appointment
        first_slot = slots[0]
        
        booking_response = await client.post(
            "/api/v1/appointments",
            headers=headers,
            json={
                "doctor_id": str(doctor.id),
                "patient_id": str(patient.id),
                "start_time": first_slot["start_time"],
                "duration_minutes": 30,
                "reason": "Annual checkup"
            }
        )
        
        assert booking_response.status_code == 201
        booking_data = booking_response.json()
        assert "confirmation_code" in booking_data
        assert "appointment_id" in booking_data
        
        appointment_id = booking_data["appointment_id"]
        
        # Step 5: Verify appointment in list
        list_response = await client.get(
            "/api/v1/appointments",
            headers=headers
        )
        
        assert list_response.status_code == 200
        appointments = list_response.json()["appointments"]
        assert any(a["id"] == appointment_id for a in appointments)
        
        # Step 6: Verify double-booking prevention
        double_booking_response = await client.post(
            "/api/v1/appointments",
            headers=headers,
            json={
                "doctor_id": str(doctor.id),
                "patient_id": str(patient.id),
                "start_time": first_slot["start_time"],
                "duration_minutes": 30,
                "reason": "Another checkup"
            }
        )
        
        # Should fail - slot already booked
        assert double_booking_response.status_code == 400


class TestReschedulingFlow:
    """
    E2E test for appointment rescheduling.
    PRD US-2: Patient Reschedules via Voice
    """
    
    @pytest.mark.asyncio
    async def test_reschedule_appointment(
        self, client: AsyncClient, test_db,
        test_patient, test_doctor, auth_headers
    ):
        """Test rescheduling an existing appointment."""
        
        # Create initial appointment
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1, hours=10)
        
        create_response = await client.post(
            "/api/v1/appointments",
            headers=auth_headers,
            json={
                "doctor_id": str(test_doctor.id),
                "patient_id": str(test_patient.id),
                "start_time": tomorrow.isoformat(),
                "duration_minutes": 30
            }
        )
        
        assert create_response.status_code == 201
        appointment_id = create_response.json()["appointment_id"]
        
        # Reschedule to next day
        new_time = tomorrow + timedelta(days=1)
        
        update_response = await client.put(
            f"/api/v1/appointments/{appointment_id}",
            headers=auth_headers,
            json={"start_time": new_time.isoformat()}
        )
        
        assert update_response.status_code == 200
        
        # Verify update
        get_response = await client.get(
            f"/api/v1/appointments/{appointment_id}",
            headers=auth_headers
        )
        
        assert get_response.status_code == 200
        updated_apt = get_response.json()
        # Start time should be updated
        assert new_time.date().isoformat() in updated_apt["start_time"]


class TestCancellationFlow:
    """
    E2E test for appointment cancellation.
    PRD US-2: Cancellation flow
    """
    
    @pytest.mark.asyncio
    async def test_cancel_appointment(
        self, client: AsyncClient, test_db,
        test_patient, test_doctor, auth_headers
    ):
        """Test cancelling an appointment."""
        
        # Create appointment
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1, hours=14)
        
        create_response = await client.post(
            "/api/v1/appointments",
            headers=auth_headers,
            json={
                "doctor_id": str(test_doctor.id),
                "patient_id": str(test_patient.id),
                "start_time": tomorrow.isoformat(),
                "duration_minutes": 30
            }
        )
        
        appointment_id = create_response.json()["appointment_id"]
        
        # Cancel with reason
        cancel_response = await client.delete(
            f"/api/v1/appointments/{appointment_id}",
            headers=auth_headers,
            params={"reason": "Schedule conflict", "notify": True}
        )
        
        assert cancel_response.status_code == 200
        assert cancel_response.json()["message"] == "Cancelled"
        
        # Verify status is cancelled
        get_response = await client.get(
            f"/api/v1/appointments/{appointment_id}",
            headers=auth_headers
        )
        
        assert get_response.status_code == 200
        assert get_response.json()["status"] == "cancelled"
