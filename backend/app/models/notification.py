"""
Notification Model
TRS Reference: Section 2.3.1 - Notifications Table
PRD Reference: FR-4 - Notifications & Reminders

Tracks SMS, email, and call notifications with delivery status.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.appointment import Appointment


class NotificationType(str, Enum):
    """Notification channel types per TRS 2.3.1."""
    SMS = "sms"
    EMAIL = "email"
    CALL = "call"


class NotificationChannel(str, Enum):
    """Specific delivery channels per TRS 2.3.1."""
    TWILIO_SMS = "twilio_sms"
    SENDGRID_EMAIL = "sendgrid_email"
    TWILIO_CALL = "twilio_call"


class NotificationStatus(str, Enum):
    """
    Notification delivery status per TRS 2.3.1.
    PRD Reference: FR-4 - Track delivery and open rates
    """
    SCHEDULED = "scheduled"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    BOUNCED = "bounced"


class Notification(Base, UUIDMixin, TimestampMixin):
    """
    Notification model for tracking all patient communications.
    TRS Reference: Section 2.3.1 - Notifications Table
    
    Attributes:
        id: UUID primary key
        appointment_id: Optional reference to related appointment
        patient_id: Reference to Patient
        type: Notification type (sms, email, call)
        channel: Delivery channel (twilio_sms, sendgrid_email, etc.)
        recipient_address: Phone or email address
        message_template: Template identifier used
        message_body: Actual message content
        scheduled_for: When to send
        sent_at: When actually sent
        delivered_at: When confirmed delivered
        status: Current delivery status
        delivery_attempts: Number of send attempts
        max_retries: Maximum retry attempts
        failure_reason: Error description if failed
        last_error_code: Provider error code
        opened_at: When email was opened (if tracked)
        clicked_at: When link was clicked (if tracked)
    """
    __tablename__ = "notifications"
    
    # References
    appointment_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Notification type and channel
    type: Mapped[NotificationType] = mapped_column(
        String(20),
        nullable=False
    )
    channel: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True
    )
    recipient_address: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    
    # Message content
    message_template: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    message_body: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # Scheduling and delivery (PRD FR-4)
    scheduled_for: Mapped[Optional[datetime]] = mapped_column(
        nullable=True,
        index=True
    )
    sent_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    delivered_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # Status tracking
    status: Mapped[NotificationStatus] = mapped_column(
        String(20),
        default=NotificationStatus.SCHEDULED.value,
        nullable=False,
        index=True
    )
    delivery_attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    max_retries: Mapped[int] = mapped_column(
        Integer,
        default=3,
        nullable=False
    )
    
    # Failure tracking (PRD FR-4 - Failed calls retry up to 3 times)
    failure_reason: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    last_error_code: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True
    )
    
    # Engagement tracking (PRD FR-4 - Track delivery and open rates)
    opened_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    clicked_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # Relationships
    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="notifications"
    )
    appointment: Mapped[Optional["Appointment"]] = relationship(
        "Appointment",
        back_populates="notifications"
    )
    
    @property
    def can_retry(self) -> bool:
        """Check if notification can be retried."""
        return (
            self.status == NotificationStatus.FAILED.value and
            self.delivery_attempts < self.max_retries
        )
    
    def __repr__(self) -> str:
        return f"<Notification {self.type.value} to {self.recipient_address} ({self.status})>"
