"""
Authentication Tests
TRS Reference: Section 2.2.1 - Authentication Endpoints
PRD Reference: US-1 - Patient Authentication
"""

import pytest
from httpx import AsyncClient


class TestAuthEndpoints:
    """Test authentication endpoints per TRS 2.2.1."""
    
    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient):
        """Test successful user registration."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "phone": "+15551234567",
                "password": "securepass123",
                "full_name": "Test User"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "user_id" in data
        assert "token" in data
        assert "refresh_token" in data
        assert "expires_in" in data
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient):
        """Test registration with duplicate email returns 409."""
        # First registration
        await client.post(
            "/api/v1/auth/register",
            json={
                "email": "duplicate@example.com",
                "phone": "+15551234568",
                "password": "securepass123",
                "full_name": "First User"
            }
        )
        
        # Duplicate registration
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "duplicate@example.com",
                "phone": "+15551234569",
                "password": "securepass123",
                "full_name": "Second User"
            }
        )
        
        assert response.status_code == 409
    
    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient):
        """Test successful login."""
        # Register first
        await client.post(
            "/api/v1/auth/register",
            json={
                "email": "login@example.com",
                "phone": "+15551234570",
                "password": "securepass123",
                "full_name": "Login User"
            }
        )
        
        # Login
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email_or_phone": "login@example.com",
                "password": "securepass123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
    
    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, client: AsyncClient):
        """Test login with invalid credentials returns 401."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email_or_phone": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        """Test health check endpoint."""
        response = await client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
