"""
Patient Model
TRS Reference: Section 2.3.1 - Patients Table
PRD Reference: FR-3 - Patient Data Management

Contains patient medical information with encrypted PHI fields.
"""

import uuid
from datetime import date, datetime
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import String, Text, Boolean, Date, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.appointment import Appointment
    from app.models.notification import Notification
    from app.models.voice_call_record import VoiceCallRecord


class Patient(Base, UUIDMixin, TimestampMixin):
    """
    Patient model with medical information.
    TRS Reference: Section 2.3.1 - Patients Table
    
    PHI Fields (Encrypted - TRS 5.2):
    - medical_history
    - allergies
    - medications
    - emergency_contact
    
    Attributes:
        id: UUID primary key
        user_id: Reference to User account
        date_of_birth: Patient DOB (required for verification)
        medical_history: Encrypted medical history text
        allergies: Encrypted allergies text
        medications: Encrypted JSONB of current medications
        emergency_contact: Encrypted emergency contact info
        preferred_contact_method: sms, email, or call
        sms_consent: Consent for SMS notifications
        email_consent: Consent for email notifications
        call_consent: Consent for voice call notifications
        encrypted_fields: Tracks which fields are encrypted
    """
    __tablename__ = "patients"
    
    # Link to User account
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    
    # Demographics
    date_of_birth: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )
    
    # Medical Information (Encrypted - TRS 5.2)
    medical_history: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Encrypted PHI"
    )
    allergies: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Encrypted PHI"
    )
    medications: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Encrypted PHI - list of current medications"
    )
    emergency_contact: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Encrypted PHI"
    )
    
    # Communication Preferences (PRD FR-3, FR-4)
    preferred_contact_method: Mapped[str] = mapped_column(
        String(20),
        default="sms",
        nullable=False
    )
    sms_consent: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    email_consent: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    call_consent: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # Encryption metadata (TRS 5.2)
    encrypted_fields: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        default=dict,
        nullable=True,
        comment="Tracks which fields are encrypted"
    )
    
    # Created by tracking (audit)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="patient",
        foreign_keys=[user_id]
    )
    appointments: Mapped[List["Appointment"]] = relationship(
        "Appointment",
        back_populates="patient"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification",
        back_populates="patient"
    )
    voice_call_records: Mapped[List["VoiceCallRecord"]] = relationship(
        "VoiceCallRecord",
        back_populates="patient"
    )
    
    # Constraints
    __table_args__ = (
        CheckConstraint(
            "preferred_contact_method IN ('sms', 'email', 'call')",
            name="valid_contact_method"
        ),
    )
    
    def __repr__(self) -> str:
        return f"<Patient {self.id} (User: {self.user_id})>"
