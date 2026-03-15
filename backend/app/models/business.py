import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    agency_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    vertical: Mapped[str | None] = mapped_column(String(50))  # salon|restaurant|repair|general
    phone_number: Mapped[str | None] = mapped_column(String(20))  # Twilio number
    twilio_sid: Mapped[str | None] = mapped_column(String(255))
    timezone: Mapped[str] = mapped_column(String(50), default="America/New_York")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    agency: Mapped["Agency"] = relationship("Agency", back_populates="businesses")
    agent_config: Mapped["AgentConfig | None"] = relationship(
        "AgentConfig", back_populates="business", uselist=False, cascade="all, delete-orphan"
    )
    calls: Mapped[list["Call"]] = relationship(
        "Call", back_populates="business", cascade="all, delete-orphan"
    )
    bookings: Mapped[list["Booking"]] = relationship(
        "Booking", back_populates="business", cascade="all, delete-orphan"
    )


class AgentConfig(Base):
    __tablename__ = "agent_configs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    business_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    template: Mapped[str] = mapped_column(String(50), nullable=False)  # salon|restaurant|repair|general
    agent_name: Mapped[str] = mapped_column(String(100), default="Alex")
    voice_id: Mapped[str] = mapped_column(String(100), default="sonic-english")
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    business_hours: Mapped[dict | None] = mapped_column(JSON)
    services: Mapped[list | None] = mapped_column(JSON)
    faq: Mapped[list | None] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    business: Mapped["Business"] = relationship("Business", back_populates="agent_config")
