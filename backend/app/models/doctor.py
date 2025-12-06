"""
Doctor Model
TRS Reference: Section 2.3.1 - Doctors Table
PRD Reference: Section 3.3 - Doctor/Clinic Features

Contains doctor profile and availability configuration.
"""

import uuid
from typing import Optional, List, Dict, Any, TYPE_CHECKING

from sqlalchemy import String, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.appointment import Appointment


# Default working hours per TRS 2.3.1
DEFAULT_WORKING_HOURS: Dict[str, Dict[str, str]] = {
    "monday": {"start": "09:00", "end": "17:00"},
    "tuesday": {"start": "09:00", "end": "17:00"},
    "wednesday": {"start": "09:00", "end": "17:00"},
    "thursday": {"start": "09:00", "end": "17:00"},
    "friday": {"start": "09:00", "end": "17:00"},
    "saturday": None,  # Not working
    "sunday": None,    # Not working
}


class Doctor(Base, UUIDMixin, TimestampMixin):
    """
    Doctor model with availability configuration.
    TRS Reference: Section 2.3.1 - Doctors Table
    
    Attributes:
        id: UUID primary key
        user_id: Reference to User account
        first_name: Doctor's first name
        last_name: Doctor's last name
        specialization: Medical specialty
        license_number: Unique medical license
        phone_number: Contact phone
        working_hours: JSONB of weekly schedule
        buffer_time_minutes: Buffer between appointments (default 15)
        appointment_duration_minutes: Default slot duration (default 30)
        max_patients_per_day: Maximum daily appointments
        clinic_id: Reference to clinic (if applicable)
        office_location: Office address/location
        is_active: Whether doctor is accepting appointments
    """
    __tablename__ = "doctors"
    
    # Link to User account
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    
    # Profile information
    first_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    last_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    specialization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )
    license_number: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )
    phone_number: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    
    # Availability Configuration (TRS 2.4)
    working_hours: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=DEFAULT_WORKING_HOURS,
        nullable=False
    )
    buffer_time_minutes: Mapped[int] = mapped_column(
        Integer,
        default=15,
        nullable=False,
        comment="Buffer time between appointments in minutes"
    )
    appointment_duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=30,
        nullable=False,
        comment="Default appointment slot duration"
    )
    max_patients_per_day: Mapped[int] = mapped_column(
        Integer,
        default=20,
        nullable=False
    )
    
    # Location
    clinic_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
        index=True,
        comment="Reference to clinic table if multi-clinic support added"
    )
    office_location: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    # Status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="doctor"
    )
    appointments: Mapped[List["Appointment"]] = relationship(
        "Appointment",
        back_populates="doctor"
    )
    
    @property
    def full_name(self) -> str:
        """Get doctor's full name."""
        return f"Dr. {self.first_name} {self.last_name}"
    
    def __repr__(self) -> str:
        return f"<Doctor {self.full_name} ({self.specialization})>"
