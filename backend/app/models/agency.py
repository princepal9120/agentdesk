import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    clerk_org_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    subdomain: Mapped[str | None] = mapped_column(String(100), unique=True)
    custom_domain: Mapped[str | None] = mapped_column(String(255), unique=True)
    branding: Mapped[dict | None] = mapped_column(JSON)  # {logo_url, primary_color, company_name}
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255))
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(50), default="starter")  # starter|pro|agency
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    businesses: Mapped[list["Business"]] = relationship(
        "Business", back_populates="agency", cascade="all, delete-orphan"
    )

    @property
    def client_limit(self) -> int:
        limits = {"starter": 3, "pro": 10, "agency": 9999}
        return limits.get(self.plan, 3)

    @property
    def monthly_call_limit(self) -> int:
        limits = {"starter": 300, "pro": 1000, "agency": 999999}
        return limits.get(self.plan, 300)
