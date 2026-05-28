"""AgentDesk initial schema

Revision ID: 001_agentdesk
Revises:
Create Date: 2026-03-15
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_agentdesk"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- agencies ---
    op.create_table(
        "agencies",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("clerk_org_id", sa.String(255), unique=True, nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("subdomain", sa.String(100), unique=True, nullable=True),
        sa.Column("custom_domain", sa.String(255), unique=True, nullable=True),
        sa.Column("branding", sa.JSON(), nullable=True),
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(255), nullable=True),
        sa.Column("plan", sa.String(50), server_default="starter", nullable=False),
        sa.Column("active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_agencies_clerk_org_id", "agencies", ["clerk_org_id"])

    # --- businesses ---
    op.create_table(
        "businesses",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "agency_id",
            sa.String(36),
            sa.ForeignKey("agencies.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("vertical", sa.String(50), nullable=True),
        sa.Column("phone_number", sa.String(20), nullable=True),
        sa.Column("twilio_sid", sa.String(255), nullable=True),
        sa.Column("timezone", sa.String(50), server_default="America/New_York"),
        sa.Column("active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_businesses_agency_id", "businesses", ["agency_id"])
    op.create_index("ix_businesses_phone_number", "businesses", ["phone_number"])

    # --- agent_configs ---
    op.create_table(
        "agent_configs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "business_id",
            sa.String(36),
            sa.ForeignKey("businesses.id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("template", sa.String(50), nullable=False),
        sa.Column("agent_name", sa.String(100), server_default="Alex"),
        sa.Column("voice_id", sa.String(100), server_default="sonic-english"),
        sa.Column("system_prompt", sa.Text(), nullable=False),
        sa.Column("business_hours", sa.JSON(), nullable=True),
        sa.Column("services", sa.JSON(), nullable=True),
        sa.Column("faq", sa.JSON(), nullable=True),
        sa.Column("flow_data", sa.JSON(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # --- calls ---
    op.create_table(
        "calls",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "business_id",
            sa.String(36),
            sa.ForeignKey("businesses.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "agency_id",
            sa.String(36),
            sa.ForeignKey("agencies.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("twilio_call_sid", sa.String(255), unique=True, nullable=True),
        sa.Column("livekit_room_id", sa.String(255), nullable=True),
        sa.Column("caller_number", sa.String(20), nullable=True),
        sa.Column("duration_sec", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(50), server_default="in_progress"),
        sa.Column("transcript", sa.JSON(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("outcome", sa.String(50), nullable=True),
        sa.Column("recording_url", sa.String(500), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_calls_business_id", "calls", ["business_id"])
    op.create_index("ix_calls_started_at", "calls", ["started_at"])

    # --- bookings ---
    op.create_table(
        "bookings",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "business_id",
            sa.String(36),
            sa.ForeignKey("businesses.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "call_id",
            sa.String(36),
            sa.ForeignKey("calls.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("customer_name", sa.String(255), nullable=True),
        sa.Column("customer_phone", sa.String(20), nullable=True),
        sa.Column("service", sa.String(255), nullable=True),
        sa.Column("appointment_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_min", sa.Integer(), server_default="60"),
        sa.Column("status", sa.String(50), server_default="confirmed"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_bookings_business_id", "bookings", ["business_id"])
    op.create_index("ix_bookings_appointment_at", "bookings", ["appointment_at"])

    # --- usage ---
    op.create_table(
        "usage",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "agency_id",
            sa.String(36),
            sa.ForeignKey("agencies.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "business_id",
            sa.String(36),
            sa.ForeignKey("businesses.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("month", sa.String(7), nullable=False),  # YYYY-MM
        sa.Column("calls_count", sa.Integer(), server_default="0"),
        sa.Column("call_minutes", sa.Integer(), server_default="0"),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("business_id", "month", name="uq_usage_business_month"),
    )


def downgrade() -> None:
    op.drop_table("usage")
    op.drop_table("bookings")
    op.drop_table("calls")
    op.drop_table("agent_configs")
    op.drop_table("businesses")
    op.drop_table("agencies")
