import base64
import hashlib
import hmac

from app.core import security


def test_generate_confirmation_code_returns_uppercase_8_char_hex_code():
    code = security.generate_confirmation_code()

    assert len(code) == 8
    assert code == code.upper()
    int(code, 16)


def test_generate_confirmation_code_produces_different_values():
    codes = {security.generate_confirmation_code() for _ in range(8)}

    assert len(codes) > 1


def test_verify_twilio_signature_accepts_valid_signature():
    url = "https://example.com/webhook"
    body = {"CallSid": "CA123", "From": "+15551234567"}
    token = "test-token"
    data = url + "".join(f"{key}{value}" for key, value in sorted(body.items()))
    signature = base64.b64encode(
        hmac.new(token.encode(), data.encode(), hashlib.sha1).digest()
    ).decode()

    assert security.verify_twilio_signature(url, body, signature, auth_token=token) is True


def test_verify_twilio_signature_rejects_invalid_signature():
    assert (
        security.verify_twilio_signature(
            "https://example.com/webhook",
            {"CallSid": "CA123"},
            "invalid",
            auth_token="test-token",
        )
        is False
    )


def test_verify_twilio_signature_rejects_missing_token(monkeypatch):
    monkeypatch.setattr(security.settings, "twilio_auth_token", None)

    assert (
        security.verify_twilio_signature(
            "https://example.com/webhook",
            {"CallSid": "CA123"},
            "anything",
        )
        is False
    )
