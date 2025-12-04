"""
Appointment Tests
TRS Reference: Section 2.2.2 - Appointment Endpoints
PRD Reference: FR-2, US-1, US-2
"""

import pytest
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from httpx import AsyncClient

from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.doctor import Doctor, DEFAULT_WORKING_HOURS
from app.core.security import hash_password, create_access_token


@pytest.fixture
async def test_user(test_db):
    """Create a test user."""
    user = User(
        email="patient@test.com",
        phone_number="+15551234567",
        password_hash=hash_password("testpass123"),
        full_name="Test Patient",
        role=UserRole.PATIENT,
        is_active=True
    )
    test_db.add(user)
    await test_db.flush()
    return user


@pytest.fixture
async def test_patient(test_db, test_user):
    """Create a test patient."""
    from datetime import date
    patient = Patient(
        user_id=test_user.id,
        date_of_birth=date(1990, 1, 15),
        sms_consent=True,
        email_consent=True
    )
    test_db.add(patient)
    await test_db.flush()
    return patient


@pytest.fixture
async def test_doctor_user(test_db):
    """Create a test doctor user."""
    user = User(
        email="doctor@test.com",
        phone_number="+15559876543",
        password_hash=hash_password("testpass123"),
        full_name="Dr. Test",
        role=UserRole.DOCTOR,
        is_active=True
    )
    test_db.add(user)
    await test_db.flush()
    return user


@pytest.fixture
async def test_doctor(test_db, test_doctor_user):
    """Create a test doctor."""
    doctor = Doctor(
        user_id=test_doctor_user.id,
        first_name="Test",
        last_name="Doctor",
        specialization="General",
        license_number="LIC123456",
        phone_number="+15559876543",
        working_hours=DEFAULT_WORKING_HOURS,
        buffer_time_minutes=15,
        appointment_duration_minutes=30,
        is_active=True
    )
    test_db.add(doctor)
    await test_db.flush()
    return doctor


@pytest.fixture
def auth_headers(test_user):
    """Generate auth headers for test user."""
    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}


class TestAppointmentEndpoints:
    """Test appointment endpoints per TRS 2.2.2."""
    
    @pytest.mark.asyncio
    async def test_create_appointment_success(
        self, client: AsyncClient, test_patient, test_doctor, auth_headers
    ):
        """Test successful appointment creation (PRD US-1)."""
        start_time = datetime.now(timezone.utc) + timedelta(days=1, hours=10)
        
        response = await client.post(
            "/api/v1/appointments",
            headers=auth_headers,
            json={
                "doctor_id": str(test_doctor.id),
                "patient_id": str(test_patient.id),
                "start_time": start_time.isoformat(),
                "duration_minutes": 30,
                "reason": "General checkup"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "appointment_id" in data
        assert "confirmation_code" in data
        assert data["reminder_scheduled"] is True
    
    @pytest.mark.asyncio
    async def test_create_appointment_invalid_doctor(
        self, client: AsyncClient, test_patient, auth_headers
    ):
        """Test appointment creation with invalid doctor."""
        start_time = datetime.now(timezone.utc) + timedelta(days=1)
        
        response = await client.post(
            "/api/v1/appointments",
            headers=auth_headers,
            json={
                "doctor_id": str(uuid4()),
                "patient_id": str(test_patient.id),
                "start_time": start_time.isoformat(),
                "duration_minutes": 30
            }
        )
        
        assert response.status_code == 400
    
    @pytest.mark.asyncio
    async def test_list_appointments(
        self, client: AsyncClient, auth_headers
    ):
        """Test listing appointments."""
        response = await client.get(
            "/api/v1/appointments",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "appointments" in data
        assert "has_more" in data
    
    @pytest.mark.asyncio
    async def test_unauthorized_access(self, client: AsyncClient):
        """Test unauthorized access returns 401."""
        response = await client.get("/api/v1/appointments")
        assert response.status_code in [401, 403]
