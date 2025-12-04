"""
Voice Call Record Model
TRS Reference: Section 2.3.1 - Voice Call Records Table
PRD Reference: FR-1 - Voice Agent Core
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Text, Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.appointment import Appointment


class VoiceCallRecord(Base, UUIDMixin, TimestampMixin):
    """Voice call record model for AI voice agent interactions."""
    __tablename__ = "voice_call_records"
    
    appointment_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="SET NULL"),
        nullable=True, index=True
    )
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    call_sid: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    call_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    recording_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    transcript: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    transcription_confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric(3, 2), nullable=True)
    detected_intent: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    conversation_outcome: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    call_started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    call_ended_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    call_duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    livekit_session_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    ai_model_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    patient: Mapped["Patient"] = relationship("Patient", back_populates="voice_call_records")
    appointment: Mapped[Optional["Appointment"]] = relationship("Appointment", back_populates="voice_call_records")
