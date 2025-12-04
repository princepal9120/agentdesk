"""
Authentication Schemas
TRS Reference: Section 2.2.1 - Authentication Endpoints
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """POST /api/v1/auth/register request body."""
    email: EmailStr
    phone: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)


class UserLogin(BaseModel):
    """POST /api/v1/auth/login request body."""
    email_or_phone: str
    password: str


class TokenResponse(BaseModel):
    """Authentication token response."""
    user_id: str
    token: str
    refresh_token: str
    expires_in: int


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
