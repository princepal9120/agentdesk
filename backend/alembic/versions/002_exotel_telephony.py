"""Add provider-neutral telephony fields for Exotel and future carriers."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "002_exotel_telephony"
down_revision: Union[str, None] = "001_agentdesk"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "businesses",
        sa.Column("telephony_provider", sa.String(30), nullable=False, server_default="twilio"),
    )
    op.add_column("businesses", sa.Column("provider_number_id", sa.String(255), nullable=True))
    op.add_column("calls", sa.Column("provider_call_id", sa.String(255), nullable=True))
    op.add_column("calls", sa.Column("telephony_provider", sa.String(30), nullable=True))
    # A unique index is supported by SQLite and Postgres, unlike ALTER TABLE
    # based unique constraints on SQLite.
    op.create_index("uq_calls_provider_call_id", "calls", ["provider_call_id"], unique=True)


def downgrade() -> None:
    op.drop_index("uq_calls_provider_call_id", table_name="calls")
    op.drop_column("calls", "telephony_provider")
    op.drop_column("calls", "provider_call_id")
    op.drop_column("businesses", "provider_number_id")
    op.drop_column("businesses", "telephony_provider")
