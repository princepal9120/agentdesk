"""
Test Configuration and Fixtures
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.main import app
from app.core.database import get_db
from app.models.base import Base

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def test_db():
    """Create test database session."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    AsyncTestSession = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncTestSession() as session:
        yield session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest_asyncio.fixture
async def client(test_db):
    """Create test client with database override."""
    async def override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Disable rate limiting for tests
    from app.core.rate_limit import RateLimitMiddleware
    
    async def mock_dispatch(self, request, call_next):
        return await call_next(request)
        
    original_dispatch = RateLimitMiddleware.dispatch
    RateLimitMiddleware.dispatch = mock_dispatch
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    # Restore original dispatch
    RateLimitMiddleware.dispatch = original_dispatch
    app.dependency_overrides.clear()


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
