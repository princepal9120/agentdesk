from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_env: str = "development"
    app_secret_key: str = "change-me"
    dev_agency_id: str = "dev-agency"
    dev_agency_name: str = "Local Demo Agency"
    voice_mode: str = "demo"  # demo|production
    voice_provider: str = "sarvam"  # sarvam|openai|full

    # Database — defaults to local SQLite for zero-install dev experience
    # Set DATABASE_URL=postgresql+asyncpg://... for production
    database_url: str = "sqlite+aiosqlite:///./agentdesk.db"

    # Redis — optional, used for rate limiting in production only
    redis_url: str = "redis://localhost:6379/0"

    # LiveKit
    livekit_url: str = ""
    livekit_api_key: str = ""
    livekit_api_secret: str = ""

    # AI Providers
    openai_api_key: str = ""
    sarvam_api_key: str = ""
    sarvam_base_url: str = "https://api.sarvam.ai/v1"
    sarvam_model: str = "sarvam-30b"
    sarvam_stt_model: str = "saaras:v3"
    sarvam_tts_model: str = "bulbul:v3"
    sarvam_tts_speaker: str = "shubh"
    sarvam_language: str = "en-IN"
    deepgram_api_key: str = ""
    cartesia_api_key: str = ""

    # Twilio
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""

    # PSTN / telephony provider.  Twilio remains the default for existing installs;
    # set TELEPHONY_PROVIDER=exotel to use an Indian Exotel trial or paid account.
    telephony_provider: str = "twilio"

    # Exotel Voice API + SIP configuration
    exotel_api_key: str = ""
    exotel_api_token: str = ""
    exotel_account_sid: str = ""
    exotel_api_base_url: str = "https://api.in.exotel.com"
    exotel_caller_id: str = ""
    exotel_flow_url: str = ""
    exotel_outbound_mode: str = "flow"  # flow|livekit
    exotel_webhook_token: str = ""
    exotel_sip_hostname: str = ""
    exotel_sip_username: str = ""
    exotel_sip_password: str = ""
    livekit_agent_name: str = "agentdesk-voice"
    livekit_sip_outbound_trunk_id: str = ""
    public_base_url: str = "http://localhost:8000"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
