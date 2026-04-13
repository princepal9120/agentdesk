"""
Auth dependencies for AgentDesk API.

Production: Clerk JWT (org-level auth — each agency = one Clerk org)
Dev mode:   Pass X-Dev-Agency-Id header + DEV_AGENCY_ID env var (no Clerk needed)
"""

from __future__ import annotations

import httpx
import json
import time
from functools import lru_cache
from fastapi import Depends, Header, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import get_settings
from app.core.database import get_db  # noqa: re-exported for convenience
from app.models.agency import Agency

bearer_scheme = HTTPBearer(auto_error=False)


# ─────────────────────────────────────────────
# Clerk JWKS (cached, refreshed every 10 min)
# ─────────────────────────────────────────────

_jwks_cache: dict = {}
_jwks_fetched_at: float = 0
JWKS_TTL = 600  # 10 minutes


async def _get_clerk_jwks() -> dict:
    global _jwks_cache, _jwks_fetched_at
    settings = get_settings()

    if time.time() - _jwks_fetched_at < JWKS_TTL and _jwks_cache:
        return _jwks_cache

    async with httpx.AsyncClient() as client:
        r = await client.get(settings.clerk_jwks_url, timeout=5)
        r.raise_for_status()
        _jwks_cache = r.json()
        _jwks_fetched_at = time.time()
    return _jwks_cache


def _decode_clerk_token(token: str, jwks: dict) -> dict:
    """Decode and verify a Clerk JWT using JWKS."""
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")

    # Find matching key
    key = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
    if not key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown JWT key")

    from jose.backends import RSAKey
    from jose import jwk
    rsa_key = jwk.construct(key)

    try:
        payload = jwt.decode(
            token,
            rsa_key.to_dict(),
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )
    return payload


# ─────────────────────────────────────────────
# Current Agency (from JWT org claim)
# ─────────────────────────────────────────────

async def get_current_agency(
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
    x_dev_agency_id: str | None = Header(default=None, alias="X-Dev-Agency-Id"),
    db: AsyncSession = Depends(get_db),
) -> Agency:
    settings = get_settings()

    # ── Dev mode shortcut ──────────────────────────────
    if settings.app_env == "development":
        dev_id = x_dev_agency_id or getattr(settings, "dev_agency_id", None)
        if dev_id:
            result = await db.execute(select(Agency).where(Agency.id == dev_id))
            agency = result.scalar_one_or_none()
            if agency:
                return agency

    # ── Require Bearer token in production ─────────────
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    jwks = await _get_clerk_jwks()
    payload = _decode_clerk_token(token, jwks)

    # Clerk puts the active org in `org_id` claim
    clerk_org_id = payload.get("org_id")
    if not clerk_org_id:
        # Fallback: sub is the user — look up their personal org
        clerk_org_id = payload.get("sub")

    if not clerk_org_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No org_id in token",
        )

    result = await db.execute(
        select(Agency).where(Agency.clerk_org_id == clerk_org_id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found — complete onboarding first",
        )

    if not agency.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agency account is suspended",
        )

    return agency
