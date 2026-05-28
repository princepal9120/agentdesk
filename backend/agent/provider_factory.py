"""Provider selection helpers for AgentDesk voice runtime.

This file creates a clean boundary between:
- conversation logic and tools
- provider-specific STT/TTS/VAD/transport wiring

Right now:
- `voice_provider=openai` is the simplified local-first path
- `voice_provider=full` keeps the existing Deepgram + Cartesia + Silero stack

The OpenAI path is intentionally conservative until runtime verification is done.
"""

from __future__ import annotations

from app.core.config import get_settings

settings = get_settings()


def get_voice_provider_mode() -> str:
    return (settings.voice_provider or "openai").lower()


def is_full_provider_mode() -> bool:
    return get_voice_provider_mode() == "full"


def get_runtime_capabilities() -> dict:
    mode = get_voice_provider_mode()
    return {
        "mode": mode,
        "uses_livekit": True,
        "uses_openai": True,
        "uses_deepgram": mode == "full",
        "uses_cartesia": mode == "full",
        "uses_silero": mode == "full",
        "openai_only_target": mode == "openai",
    }
