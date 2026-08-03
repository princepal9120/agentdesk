import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, JSON, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Call(Base):
    __tablename__ = "calls"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    agency_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False
    )
    twilio_call_sid: Mapped[str | None] = mapped_column(String(255), unique=True)
    provider_call_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    contact_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("contacts.id", ondelete="SET NULL"))
    campaign_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="SET NULL"))
    flow_version_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("flow_versions.id", ondelete="SET NULL"))
    direction: Mapped[str] = mapped_column(String(20), default="inbound")
    telephony_provider: Mapped[str | None] = mapped_column(String(30))
    livekit_room_id: Mapped[str | None] = mapped_column(String(255))
    caller_number: Mapped[str | None] = mapped_column(String(20))
    duration_sec: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(50), default="in_progress")
    # answered | missed | voicemail | failed
    transcript: Mapped[list | None] = mapped_column(JSON)
    # [{role: "agent"|"user", content: str, timestamp: iso}]
    summary: Mapped[str | None] = mapped_column(Text)
    outcome: Mapped[str | None] = mapped_column(String(50))
    # booked | cancelled | inquiry | callback | other
    recording_url: Mapped[str | None] = mapped_column(String(500))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    business: Mapped["Business"] = relationship("Business", back_populates="calls")
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="call")


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(255))
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    extra_data: Mapped[dict | None] = mapped_column(JSON)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class FlowVersion(Base):
    __tablename__ = "flow_versions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), default="Untitled call flow")
    nodes: Mapped[list] = mapped_column(JSON, default=list)
    start_node_id: Mapped[str | None] = mapped_column(String(100))
    version: Mapped[int] = mapped_column(Integer, default=1)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id: Mapped[str] = mapped_column(String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    flow_version_id: Mapped[str] = mapped_column(String(36), ForeignKey("flow_versions.id", ondelete="RESTRICT"), nullable=False)
    contact_ids: Mapped[list] = mapped_column(JSON, default=list)
    name: Mapped[str] = mapped_column(String(255), default="Call campaign")
    status: Mapped[str] = mapped_column(String(30), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    call_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("calls.id", ondelete="SET NULL")
    )
    customer_name: Mapped[str | None] = mapped_column(String(255))
    customer_phone: Mapped[str | None] = mapped_column(String(20))
    service: Mapped[str | None] = mapped_column(String(255))
    appointment_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_min: Mapped[int] = mapped_column(Integer, default=60)
    status: Mapped[str] = mapped_column(String(50), default="confirmed")
    # confirmed | cancelled | completed | no_show
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    business: Mapped["Business"] = relationship("Business", back_populates="bookings")
    call: Mapped["Call | None"] = relationship("Call", back_populates="bookings")


class Usage(Base):
    __tablename__ = "usage"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    agency_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False
    )
    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    month: Mapped[str] = mapped_column(String(7), nullable=False)  # YYYY-MM
    calls_count: Mapped[int] = mapped_column(Integer, default=0)
    call_minutes: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )
