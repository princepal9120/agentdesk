"""Provider selection helpers for AgentDesk voice runtime.

This file creates a clean boundary between:
- conversation logic and tools
- provider-specific STT/TTS/VAD/transport wiring

The default local path uses Sarvam's LiveKit plugins for STT/TTS and Sarvam's
OpenAI-compatible chat endpoint for the LLM.
`voice_provider=openai` remains available for existing installations, while
`voice_provider=full` keeps the existing Deepgram + Cartesia + Silero stack.
"""

from __future__ import annotations

from app.core.config import get_settings

settings = get_settings()


def get_voice_provider_mode() -> str:
    return (settings.voice_provider or "sarvam").lower()


def is_full_provider_mode() -> bool:
    return get_voice_provider_mode() == "full"


def is_sarvam_provider_mode() -> bool:
    return get_voice_provider_mode() == "sarvam"


def get_runtime_capabilities() -> dict:
    mode = get_voice_provider_mode()
    return {
        "mode": mode,
        "uses_livekit": True,
        "uses_openai": mode in {"openai", "full"},
        "uses_sarvam": mode == "sarvam",
        "uses_deepgram": mode == "full",
        "uses_cartesia": mode == "full",
        "uses_silero": mode in {"full", "sarvam"},
        "sarvam_only_target": mode == "sarvam",
    }
