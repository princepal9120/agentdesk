from types import SimpleNamespace
import asyncio

import httpx
import pytest

from app.services.telephony import (
    ExotelClient,
    TelephonyConfigurationError,
    normalize_e164,
)


def exotel_settings(**overrides):
    values = {
        "exotel_api_key": "key",
        "exotel_api_token": "token",
        "exotel_account_sid": "account",
        "exotel_api_base_url": "https://api.in.exotel.com",
        "exotel_caller_id": "+919876543210",
        "exotel_flow_url": "https://my.exotel.in/exoml/start/app-123",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_exotel_connect_customer_to_flow_posts_expected_request():
    seen = {}

    async def handler(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        seen["auth"] = request.headers["authorization"]
        seen["form"] = dict(httpx.QueryParams(request.content.decode()))
        return httpx.Response(
            200,
            json={"Call": {"Sid": "call-123", "Status": "queued"}},
        )

    client = ExotelClient(exotel_settings(), httpx.MockTransport(handler))
    result = asyncio.run(
        client.connect_customer_to_flow(
            "+91 98765 43210",
            custom_field="appointment_id=apt-1",
            status_callback="https://example.test/webhooks/exotel/status",
        )
    )

    assert result.provider_call_id == "call-123"
    assert seen["url"].endswith("/v1/Accounts/account/Calls/connect")
    assert seen["form"]["From"] == "+919876543210"
    assert seen["form"]["CallerId"] == "+919876543210"
    assert seen["form"]["Url"].endswith("app-123")
    assert seen["form"]["CustomField"] == "appointment_id=apt-1"


def test_normalize_e164_rejects_local_number():
    with pytest.raises(ValueError, match="E.164"):
        normalize_e164("09876543210")


def test_exotel_requires_flow_url_for_flow_calls():
    client = ExotelClient(exotel_settings(exotel_flow_url=""))

    with pytest.raises(TelephonyConfigurationError, match="EXOTEL_FLOW_URL"):
        asyncio.run(client.connect_customer_to_flow("+919876543210"))
