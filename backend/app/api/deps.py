"""
Open source friendly agency resolution.

The OSS build uses a single local demo agency by default so contributors can run
AgentDesk without Clerk or custom auth wiring.
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.models.agency import Agency


async def get_current_agency(
    db: AsyncSession = Depends(get_db),
) -> Agency:
    settings = get_settings()

    result = await db.execute(select(Agency).where(Agency.id == settings.dev_agency_id))
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Demo agency is not initialized yet",
        )

    if not agency.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo agency is disabled",
        )

    return agency
