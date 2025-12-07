"""
Authentication Schemas
TRS Reference: Section 2.2.1 - Authentication Endpoints
"""

from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """POST /api/v1/auth/register request body."""
    email: EmailStr
    phone_number: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = Field("patient", pattern="^(patient|doctor|receptionist|admin)$")


class UserLogin(BaseModel):
    """POST /api/v1/auth/login request body."""
    email_or_phone: str
    password: str


class UserResponse(BaseModel):
    """User response model."""
    id: UUID
    email: EmailStr
    phone_number: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    patient_id: Optional[UUID] = None  # Set when role is patient
    doctor_id: Optional[UUID] = None   # Set when role is doctor
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Authentication token response."""
    user_id: str
    token: str
    refresh_token: str
    expires_in: int
    user: UserResponse


class OTPRequest(BaseModel):
    """POST /api/v1/auth/otp/request body."""
    phone_number: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")


class OTPRequestResponse(BaseModel):
    """OTP request response."""
    otp_id: str
    expires_in: int


class OTPVerify(BaseModel):
    """POST /api/v1/auth/otp/verify body."""
    otp_id: str
    otp_code: str = Field(..., min_length=6, max_length=6)


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
