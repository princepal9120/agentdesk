"""Lightweight backend smoke checks for local OSS validation."""

from app.core.config import get_settings


def main() -> None:
    settings = get_settings()
    print("AgentDesk backend smoke test")
    print(f"app_env={settings.app_env}")
    print(f"voice_mode={settings.voice_mode}")
    print(f"voice_provider={settings.voice_provider}")
    print(f"public_base_url={settings.public_base_url}")
    print(f"stripe_configured={bool(settings.stripe_secret_key)}")
    print(f"twilio_configured={bool(settings.twilio_account_sid and settings.twilio_auth_token)}")


if __name__ == "__main__":
    main()
