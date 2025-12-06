"""
Appointment Tests
TRS Reference: Section 2.2.2 - Appointment Endpoints
PRD Reference: FR-2, US-1, US-2
"""

import pytest
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from httpx import AsyncClient

from app.core.security import create_access_token





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
