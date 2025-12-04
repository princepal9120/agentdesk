"""
Appointment Model
TRS Reference: Section 2.3.1 - Appointments Table
PRD Reference: FR-2 - Appointment Management

Core appointment model with status tracking, scheduling,
and cancellation handling.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import String, Text, Boolean, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.notification import Notification
    from app.models.voice_call_record import VoiceCallRecord


class AppointmentStatus(str, Enum):
    """
    Appointment status values per TRS 2.3.1.
    PRD Reference: FR-2 - Track no-shows and cancellations
    """
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class AppointmentType(str, Enum):
    """
    Appointment type values per TRS 2.3.1.
    """
    GENERAL = "general"
    FOLLOW_UP = "follow_up"
    CONSULTATION = "consultation"
    EMERGENCY = "emergency"


class CancellationInitiator(str, Enum):
    """
    Who initiated the cancellation per TRS 2.3.1.
    PRD Reference: US-2 - Cancellation reason tracked for analytics
    """
    PATIENT = "patient"
    DOCTOR = "doctor"
    SYSTEM = "system"


class Appointment(Base, UUIDMixin, TimestampMixin):
    """
    Appointment model for scheduling doctor visits.
    TRS Reference: Section 2.3.1 - Appointments Table
    
    Attributes:
        id: UUID primary key
        patient_id: Reference to Patient
        doctor_id: Reference to Doctor
        start_time: Appointment start timestamp
        end_time: Appointment end timestamp
        status: Current appointment status
        appointment_type: Type of appointment
        reason_for_visit: Patient's stated reason
        notes: Doctor/staff notes
        confirmed_by_patient: Patient confirmation flag
        confirmed_by_doctor: Doctor confirmation flag
        last_reminder_sent_at: Last reminder timestamp
        no_show_recorded_at: When no-show was recorded
        cancelled_at: Cancellation timestamp
        cancellation_reason: Reason for cancellation
        cancellation_initiator: Who cancelled
        is_virtual: Telemedicine appointment
        video_call_link: Telemedicine link
        confirmation_code: Unique booking confirmation code
    """
    __tablename__ = "appointments"
    
    # Core references
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    
    # Scheduling (TRS 2.2.2, PRD FR-2)
    start_time: Mapped[datetime] = mapped_column(
        nullable=False,
        index=True
    )
    end_time: Mapped[datetime] = mapped_column(
        nullable=False
    )
    
    # Status tracking
    status: Mapped[AppointmentStatus] = mapped_column(
        String(20),
        default=AppointmentStatus.SCHEDULED.value,
        nullable=False,
        index=True
    )
    appointment_type: Mapped[AppointmentType] = mapped_column(
        String(50),
        default=AppointmentType.GENERAL.value,
        nullable=False
    )
    
    # Reason and notes
    reason_for_visit: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # Confirmation tracking (PRD US-3)
    confirmed_by_patient: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    confirmed_by_doctor: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    last_reminder_sent_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # No-show tracking (PRD FR-2)
    no_show_recorded_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # Cancellation info (PRD US-2)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    cancellation_reason: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    cancellation_initiator: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True
    )
    
    # Telemedicine (PRD Section 3.2)
    is_virtual: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    video_call_link: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    # Confirmation code (TRS 2.2.2)
    confirmation_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )
    
    # Created by tracking
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="appointments"
    )
    doctor: Mapped["Doctor"] = relationship(
        "Doctor",
        back_populates="appointments"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification",
        back_populates="appointment"
    )
    voice_call_records: Mapped[List["VoiceCallRecord"]] = relationship(
        "VoiceCallRecord",
        back_populates="appointment"
    )
    
    # Constraints (TRS 2.3.1)
    __table_args__ = (
        # Prevent double-booking: unique constraint on doctor + start_time
        UniqueConstraint(
            "doctor_id", "start_time",
            name="uq_doctor_start_time"
        ),
        # Ensure end_time is after start_time
        CheckConstraint(
            "end_time > start_time",
            name="valid_time_range"
        ),
    )
    
    @property
    def duration_minutes(self) -> int:
        """Calculate appointment duration in minutes."""
        return int((self.end_time - self.start_time).total_seconds() / 60)
    
    @property
    def is_past(self) -> bool:
        """Check if appointment is in the past."""
        return self.start_time < datetime.now(self.start_time.tzinfo)
    
    @property
    def is_cancellable(self) -> bool:
        """Check if appointment can be cancelled."""
        return self.status in [
            AppointmentStatus.SCHEDULED.value,
            AppointmentStatus.CONFIRMED.value
        ] and not self.is_past
    
    def __repr__(self) -> str:
        return f"<Appointment {self.confirmation_code} ({self.status})>"
