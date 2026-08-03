"""Provider-neutral telephony services.

Exotel deliberately uses its HTTP API here instead of a third-party SDK.  This
keeps the trial path small and makes the provider boundary easy to test.  LiveKit
SIP is handled separately because it owns the realtime media connection.
"""

from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Any

import httpx

from app.core.config import get_settings


class TelephonyConfigurationError(RuntimeError):
    """Raised when the selected provider is not configured."""


class TelephonyRequestError(RuntimeError):
    """Raised when a provider rejects a request."""


@dataclass(frozen=True)
class OutboundCallResult:
    provider_call_id: str
    status: str
    raw: dict[str, Any]


def normalize_e164(phone_number: str) -> str:
    """Normalize and validate a phone number for current Exotel APIs."""

    value = re.sub(r"[\s().-]", "", phone_number or "")
    if not re.fullmatch(r"\+[1-9]\d{7,14}", value):
        raise ValueError("Phone numbers must use E.164 format, for example +919876543210")
    return value


class ExotelClient:
    """Small async client for Exotel Voice v1 and trial accounts."""

    def __init__(self, settings=None, transport: httpx.AsyncBaseTransport | None = None):
        self.settings = settings or get_settings()
        self.transport = transport

    def _require_api_config(self) -> None:
        missing = [
            name
            for name, value in (
                ("EXOTEL_API_KEY", self.settings.exotel_api_key),
                ("EXOTEL_API_TOKEN", self.settings.exotel_api_token),
                ("EXOTEL_ACCOUNT_SID", self.settings.exotel_account_sid),
                ("EXOTEL_CALLER_ID", self.settings.exotel_caller_id),
            )
            if not value
        ]
        if missing:
            raise TelephonyConfigurationError(
                "Exotel is selected but these settings are missing: " + ", ".join(missing)
            )

    def _calls_url(self) -> str:
        return (
            f"{self.settings.exotel_api_base_url.rstrip('/')}/v1/Accounts/"
            f"{self.settings.exotel_account_sid}/Calls/connect"
        )

    async def connect_customer_to_flow(
        self,
        customer_number: str,
        *,
        custom_field: str = "",
        status_callback: str = "",
    ) -> OutboundCallResult:
        """Call a customer and connect them to an Exotel flow.

        The flow URL is configured in the Exotel dashboard and can contain the
        reminder greeting/IVR.  This is the reliable trial-compatible path for
        a reminder call.  For a conversational AI call, use LiveKit SIP below.
        """

        self._require_api_config()
        if not self.settings.exotel_flow_url:
            raise TelephonyConfigurationError(
                "EXOTEL_FLOW_URL is required for Exotel reminder calls"
            )

        data: dict[str, Any] = {
            "From": normalize_e164(customer_number),
            "CallerId": normalize_e164(self.settings.exotel_caller_id),
            "CallType": "trans",
            "Url": self.settings.exotel_flow_url,
            "TimeLimit": "600",
            "TimeOut": "30",
        }
        if custom_field:
            data["CustomField"] = custom_field[:128]
        if status_callback:
            data["StatusCallback"] = status_callback
            data["StatusCallbackEvents"] = ["terminal", "answered"]
            data["StatusCallbackContentType"] = "application/json"

        async with httpx.AsyncClient(
            auth=(self.settings.exotel_api_key, self.settings.exotel_api_token),
            timeout=20.0,
            transport=self.transport,
        ) as client:
            response = await client.post(self._calls_url(), data=data)

        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise TelephonyRequestError(
                f"Exotel call request failed ({response.status_code}): {response.text[:500]}"
            ) from exc

        try:
            payload = response.json()
        except ValueError as exc:
            raise TelephonyRequestError("Exotel returned a non-JSON call response") from exc

        call = payload.get("Call", payload.get("call", payload))
        provider_call_id = str(call.get("Sid", call.get("sid", "")))
        if not provider_call_id:
            raise TelephonyRequestError("Exotel response did not include a call SID")

        return OutboundCallResult(
            provider_call_id=provider_call_id,
            status=str(call.get("Status", call.get("status", "queued"))),
            raw=payload,
        )


def exotel_status_callback_url() -> str:
    settings = get_settings()
    url = f"{settings.public_base_url.rstrip('/')}/webhooks/exotel/status"
    if settings.exotel_webhook_token:
        url += f"?token={settings.exotel_webhook_token}"
    return url
