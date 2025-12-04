"""
User Model
TRS Reference: Section 2.2.1 - Authentication Endpoints
PRD Reference: Section 3.3 - Staff Management (RBAC)

Base user model for authentication. Extended by Patient and Doctor
through relationships.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.audit_log import AuditLog


class UserRole(str, Enum):
    """
    User roles for RBAC (Role-Based Access Control).
    TRS Reference: Section 5.1 - Access Controls
    PRD Reference: Section 3.3 - Staff Management
    """
    PATIENT = "patient"
    DOCTOR = "doctor"
    RECEPTIONIST = "receptionist"
    ADMIN = "admin"


class User(Base, UUIDMixin, TimestampMixin):
    """
    User model for authentication and authorization.
    
    Attributes:
        id: UUID primary key
        email: Unique email address
        phone_number: Unique phone number
        password_hash: Bcrypt hashed password
        full_name: User's full name
        role: User role for RBAC
        is_active: Whether account is active
        is_verified: Whether email/phone is verified
        last_login: Timestamp of last login
        mfa_enabled: Whether MFA is enabled
        mfa_secret: TOTP secret for MFA (encrypted)
    """
    __tablename__ = "users"
    
    # Core fields
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )
    phone_number: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    
    # Role and status
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        default=UserRole.PATIENT,
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # Session tracking
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Multi-factor authentication (TRS 2.2.1)
    mfa_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    mfa_secret: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    # Relationships
    patient: Mapped[Optional["Patient"]] = relationship(
        "Patient",
        back_populates="user",
        uselist=False
    )
    doctor: Mapped[Optional["Doctor"]] = relationship(
        "Doctor",
        back_populates="user",
        uselist=False
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="user"
    )
    
    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role.value})>"
