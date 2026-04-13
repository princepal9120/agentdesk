#!/usr/bin/env python3
"""
AgentDesk voice agent runner.

Modes:
- demo: local-first onboarding mode, skips hard failure when full voice stack is not configured
- production: requires full provider configuration
"""

import os
import sys
import logging
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import get_settings


def setup_logging():
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler()]
    )


def print_banner(settings):
    print("""
╔════════════════════════════════════════════════════════════╗
║                     AgentDesk Worker                      ║
╚════════════════════════════════════════════════════════════╝
    """)
    print(f"Mode:         {settings.voice_mode}")
    print(f"Provider:     {settings.voice_provider}")
    print(f"Environment:  {settings.app_env}")
    print(f"LiveKit URL:  {settings.livekit_url}")
    print()


def validate_demo_mode(settings):
    missing = []
    if not settings.openai_api_key:
        missing.append("OPENAI_API_KEY")

    if missing:
        print("⚠️  Demo mode still needs:")
        for item in missing:
            print(f"   - {item}")
        print("\nAgent worker will not start until minimum demo config is present.\n")
        return False

    print("ℹ️  Running in demo mode. Full telephony providers are optional for local onboarding.")
    if settings.voice_provider == "openai":
        print("ℹ️  OpenAI-first provider mode enabled.")
    return True


def validate_production_mode(settings):
    required = [
        "openai_api_key",
        "livekit_url",
        "livekit_api_key",
        "livekit_api_secret",
    ]
    if settings.voice_provider == "full":
        required.extend([
            "deepgram_api_key",
            "cartesia_api_key",
            "twilio_account_sid",
            "twilio_auth_token",
        ])
    missing = [field.upper() for field in required if not getattr(settings, field, None)]
    if missing:
        print("❌ Production mode is missing required config:")
        for item in missing:
            print(f"   - {item}")
        print()
        return False
    return True


def main():
    setup_logging()
    settings = get_settings()
    print_banner(settings)

    ok = validate_demo_mode(settings) if settings.voice_mode == "demo" else validate_production_mode(settings)
    if not ok:
        sys.exit(0 if settings.voice_mode == "demo" else 1)

    try:
        from agent.agent import entrypoint
        from livekit.agents import cli, WorkerOptions
    except Exception as e:
        print(f"⚠️  Agent runtime import failed: {e}")
        print("If this is local onboarding only, the dashboard and API can still be used.")
        sys.exit(0 if settings.voice_mode == "demo" else 1)

    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            api_key=settings.livekit_api_key,
            api_secret=settings.livekit_api_secret,
            ws_url=settings.livekit_url,
        )
    )


if __name__ == "__main__":
    main()
