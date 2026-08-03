import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    subdomain: Mapped[str | None] = mapped_column(String(100), unique=True)
    custom_domain: Mapped[str | None] = mapped_column(String(255), unique=True)
    branding: Mapped[dict | None] = mapped_column(JSON)  # {logo_url, primary_color, company_name}
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    businesses: Mapped[list["Business"]] = relationship(  # type: ignore[assignment]
        "Business", back_populates="agency", cascade="all, delete-orphan"
    )

    @property
    def client_limit(self) -> int:
        return 999999

    @property
    def monthly_call_limit(self) -> int:
        return 999999
