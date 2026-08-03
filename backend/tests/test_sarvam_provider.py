from types import SimpleNamespace

from agent import provider_factory
from run_agent import validate_demo_mode, validate_production_mode


def test_sarvam_mode_exposes_end_to_end_capabilities(monkeypatch):
    monkeypatch.setattr(provider_factory.settings, "voice_provider", "sarvam")

    capabilities = provider_factory.get_runtime_capabilities()

    assert capabilities["uses_sarvam"] is True
    assert capabilities["uses_openai"] is False
    assert capabilities["uses_deepgram"] is False
    assert capabilities["uses_cartesia"] is False
    assert capabilities["uses_silero"] is True


def test_demo_validation_requires_sarvam_key_for_sarvam_mode(capsys):
    settings = SimpleNamespace(
        voice_mode="demo",
        voice_provider="sarvam",
        sarvam_api_key="",
        openai_api_key="",
    )

    assert validate_demo_mode(settings) is False
    assert "SARVAM_API_KEY" in capsys.readouterr().out


def test_production_validation_requires_sarvam_key_for_sarvam_mode():
    settings = SimpleNamespace(
        voice_provider="sarvam",
        sarvam_api_key="",
        openai_api_key="",
        livekit_url="wss://example.livekit.cloud",
        livekit_api_key="key",
        livekit_api_secret="secret",
    )

    assert validate_production_mode(settings) is False
