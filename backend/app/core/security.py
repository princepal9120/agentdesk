"""
Minimal security helpers used by the OSS backend.

This module intentionally keeps only the utilities that match the current
open-source AgentDesk config surface.
"""

import base64
import hashlib
import hmac
import secrets
from typing import Any

from app.core.config import get_settings

settings = get_settings()


def verify_twilio_signature(
    request_url: str,
    request_body: dict[str, Any],
    signature: str,
    auth_token: str | None = None,
) -> bool:
    """Verify a Twilio webhook signature using the configured auth token."""
    token = auth_token or settings.twilio_auth_token
    if not token:
        return False

    sorted_params = "".join(f"{k}{v}" for k, v in sorted(request_body.items()))
    data = f"{request_url}{sorted_params}"
    expected_sig = base64.b64encode(
        hmac.new(token.encode(), data.encode(), hashlib.sha1).digest()
    ).decode()
    return hmac.compare_digest(signature, expected_sig)


def generate_confirmation_code() -> str:
    """Generate an 8-character uppercase confirmation code."""
    return secrets.token_hex(4).upper()
