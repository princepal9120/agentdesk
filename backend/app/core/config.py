from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_env: str = "development"
    app_secret_key: str = "change-me"
    dev_agency_id: str = "dev-agency"
    dev_agency_name: str = "Local Demo Agency"
    voice_mode: str = "demo"  # demo|production
    voice_provider: str = "openai"  # openai|full

    # Database
    database_url: str

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # LiveKit
    livekit_url: str = ""
    livekit_api_key: str = ""
    livekit_api_secret: str = ""

    # AI Providers
    openai_api_key: str
    deepgram_api_key: str = ""
    cartesia_api_key: str = ""

    # Twilio
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""

    # Stripe
    stripe_secret_key: str
    stripe_webhook_secret: str
    stripe_starter_price_id: str = ""
    stripe_pro_price_id: str = ""
    stripe_agency_price_id: str = ""

    # Clerk
    clerk_secret_key: str = ""
    clerk_publishable_key: str = ""
    clerk_jwks_url: str = ""

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
