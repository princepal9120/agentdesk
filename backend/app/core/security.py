"""
Security Utilities
TRS Reference: Section 5 - Security & Compliance
PRD Reference: NFR-2 - Security & Compliance

Handles:
- Password hashing (bcrypt)
- JWT token generation/validation
- Encryption for PHI data (AES-256)
- Webhook signature verification
"""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict
from uuid import UUID

from jose import jwt, JWTError
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

from app.core.config import settings


# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =============================================================================
# Password Hashing (TRS 2.2.1 Authentication)
# =============================================================================

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Stored hashed password
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


# =============================================================================
# JWT Token Management (TRS 2.2.1 Authentication)
# =============================================================================

def create_access_token(
    subject: str | UUID,
    expires_delta: Optional[timedelta] = None,
    additional_claims: Optional[Dict[str, Any]] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        subject: Token subject (usually user_id)
        expires_delta: Optional custom expiration time
        additional_claims: Optional additional JWT claims
        
    Returns:
        Encoded JWT token string
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    }
    
    if additional_claims:
        to_encode.update(additional_claims)
    
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )


def create_refresh_token(
    subject: str | UUID,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT refresh token.
    
    Args:
        subject: Token subject (usually user_id)
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT refresh token string
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        )
    
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    }
    
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """
    Verify a JWT token and return the subject.
    
    Args:
        token: JWT token string
        token_type: Expected token type ("access" or "refresh")
        
    Returns:
        Token subject (user_id) or None if invalid
    """
    payload = decode_token(token)
    if payload is None:
        return None
    
    if payload.get("type") != token_type:
        return None
    
    return payload.get("sub")


# =============================================================================
# OTP Generation (TRS 2.2.1 - Multi-factor Authentication)
# =============================================================================

def generate_otp(length: int = 6) -> str:
    """
    Generate a secure random OTP code.
    
    Args:
        length: Number of digits in OTP (default: 6)
        
    Returns:
        Numeric OTP string
    """
    return "".join([str(secrets.randbelow(10)) for _ in range(length)])


def generate_otp_id() -> str:
    """
    Generate a unique OTP identifier for tracking.
    
    Returns:
        URL-safe unique identifier
    """
    return secrets.token_urlsafe(32)


# =============================================================================
# PHI Encryption (TRS 5.2 - HIPAA Compliance)
# =============================================================================

def _get_fernet_key() -> bytes:
    """
    Derive a Fernet-compatible key from the encryption key.
    Uses PBKDF2 for key derivation.
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b"healthcare-voice-agent-salt",  # In production, use env-specific salt
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(
        kdf.derive(settings.ENCRYPTION_KEY.encode())
    )
    return key


def encrypt_phi(data: str) -> str:
    """
    Encrypt PHI (Protected Health Information) data using AES-256.
    TRS Reference: Section 5.2 - Data Encryption
    
    Args:
        data: Plain text PHI data
        
    Returns:
        Encrypted data as base64 string
    """
    if not data:
        return data
    
    fernet = Fernet(_get_fernet_key())
    encrypted = fernet.encrypt(data.encode())
    return encrypted.decode()


def decrypt_phi(encrypted_data: str) -> str:
    """
    Decrypt PHI (Protected Health Information) data.
    TRS Reference: Section 5.2 - Data Encryption
    
    Args:
        encrypted_data: Encrypted data as base64 string
        
    Returns:
        Decrypted plain text data
    """
    if not encrypted_data:
        return encrypted_data
    
    fernet = Fernet(_get_fernet_key())
    decrypted = fernet.decrypt(encrypted_data.encode())
    return decrypted.decode()


# =============================================================================
# Webhook Signature Verification (TRS 2.2.5)
# =============================================================================

def verify_twilio_signature(
    request_url: str,
    request_body: Dict[str, Any],
    signature: str,
    auth_token: Optional[str] = None
) -> bool:
    """
    Verify Twilio webhook request signature.
    TRS Reference: Section 2.2.5 - Webhook Signature Verification
    
    Prevents unauthorized webhook calls using HMAC-SHA1.
    Uses constant-time comparison to prevent timing attacks.
    
    Args:
        request_url: Full URL of the webhook request
        request_body: Request body as dictionary
        signature: X-Twilio-Signature header value
        auth_token: Twilio auth token (uses settings if not provided)
        
    Returns:
        True if signature is valid, False otherwise
    """
    if auth_token is None:
        auth_token = settings.TWILIO_AUTH_TOKEN
    
    if not auth_token:
        return False
    
    # Sort and concatenate request parameters
    sorted_params = "".join(
        f"{k}{v}" for k, v in sorted(request_body.items())
    )
    data = f"{request_url}{sorted_params}"
    
    # Generate expected signature
    expected_sig = base64.b64encode(
        hmac.new(
            auth_token.encode(),
            data.encode(),
            hashlib.sha1
        ).digest()
    ).decode()
    
    # Constant-time comparison to prevent timing attacks
    return hmac.compare_digest(signature, expected_sig)


def generate_confirmation_code() -> str:
    """
    Generate a unique confirmation code for appointments.
    
    Returns:
        8-character alphanumeric confirmation code
    """
    return secrets.token_hex(4).upper()
