"""
Authentication Router
TRS Reference: Section 2.2.1 - Authentication Endpoints
PRD Reference: FR-3 - Patient Data Management (MFA)
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
import redis.asyncio as redis

from app.core.database import get_db
from app.core.redis import get_redis
from app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, generate_otp, generate_otp_id
)
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, OTPRequest,
    OTPRequestResponse, OTPVerify, MessageResponse, UserResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user.
    TRS 2.2.1: POST /api/v1/auth/register
    """
    # Check if user exists
    result = await db.execute(
        select(User).where(
            or_(User.email == data.email, User.phone_number == data.phone_number)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="User already exists")
    
    # Create user
    user = User(
        email=data.email,
        phone_number=data.phone_number,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role=UserRole.PATIENT
    )
    db.add(user)
    await db.flush()
    
    # Generate tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return TokenResponse(
        user_id=str(user.id),
        token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Login user.
    TRS 2.2.1: POST /api/v1/auth/login
    """
    result = await db.execute(
        select(User).where(
            or_(
                User.email == data.email_or_phone,
                User.phone_number == data.email_or_phone
            )
        )
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account disabled")
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return TokenResponse(
        user_id=str(user.id),
        token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user
    )


@router.post("/otp/request", response_model=OTPRequestResponse)
async def request_otp(
    data: OTPRequest,
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Request OTP for phone verification.
    TRS 2.2.1: POST /api/v1/auth/otp/request
    """
    otp_id = generate_otp_id()
    otp_code = generate_otp()
    
    # Store OTP in Redis with TTL
    await redis_client.setex(
        f"otp:{otp_id}",
        settings.REDIS_OTP_TTL,
        f"{data.phone_number}:{otp_code}"
    )
    
    # TODO: Send OTP via Twilio SMS
    # In development, log the OTP
    print(f"[DEV] OTP for {data.phone_number}: {otp_code}")
    
    return OTPRequestResponse(
        otp_id=otp_id,
        expires_in=settings.REDIS_OTP_TTL
    )


@router.post("/otp/verify", response_model=TokenResponse)
async def verify_otp(
    data: OTPVerify,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Verify OTP and return tokens.
    TRS 2.2.1: POST /api/v1/auth/otp/verify
    """
    stored = await redis_client.get(f"otp:{data.otp_id}")
    if not stored:
        raise HTTPException(status_code=401, detail="OTP expired")
    
    phone_number, otp_code = stored.split(":")
    if otp_code != data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Delete used OTP
    await redis_client.delete(f"otp:{data.otp_id}")
    
    # Find or create user
    result = await db.execute(
        select(User).where(User.phone_number == phone_number)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return TokenResponse(
        user_id=str(user.id),
        token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logout user.
    TRS 2.2.1: POST /api/v1/auth/logout
    """
    # TODO: Invalidate refresh token in Redis
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile.
    TRS 2.2.1: GET /api/v1/auth/me
    """
    return current_user
