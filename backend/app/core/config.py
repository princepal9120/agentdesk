"""
Application Configuration
TRS Reference: Section 2.1 - Core Technology Stack
PRD Reference: NFR-2 Security & Compliance

Handles all environment variables and configuration settings
with validation using Pydantic Settings.
"""

from functools import lru_cache
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic for validation and type coercion.
    """
    
    # Application
    APP_NAME: str = "Healthcare Voice Agent API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = Field(default="development", pattern="^(development|staging|production)$")
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database - PostgreSQL (TRS 2.1)
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/healthcare_voice_agent",
        description="PostgreSQL connection string with asyncpg driver"
    )
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30
    
    # Redis Cache (TRS 2.1)
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL for caching and sessions"
    )
    REDIS_AVAILABILITY_TTL: int = 5  # seconds - TRS 2.4 requirement
    REDIS_SESSION_TTL: int = 86400  # 24 hours - TRS 1.1
    REDIS_OTP_TTL: int = 600  # 10 minutes - TRS 1.1
    
    # JWT Authentication (TRS 2.2.1)
    JWT_SECRET_KEY: str = Field(
        default="your-super-secret-key-change-in-production",
        description="Secret key for JWT token signing"
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Rate Limiting (TRS 2.5)
    RATE_LIMIT_AUTH_PER_MINUTE: int = 5
    RATE_LIMIT_APPOINTMENTS_PER_MINUTE: int = 100
    RATE_LIMIT_AVAILABILITY_PER_MINUTE: int = 500
    
    # Twilio Configuration (TRS 1.1, 2.2.4)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Resend Email (replaces SendGrid)
    RESEND_API_KEY: Optional[str] = None
    RESEND_FROM_EMAIL: Optional[str] = "HealthVoice <noreply@healthvoice.com>"
    
    # External AI Services (TRS 1.1)
    OPENAI_API_KEY: Optional[str] = None
    ASSEMBLYAI_API_KEY: Optional[str] = None
    
    # Encryption (TRS 5.2 - HIPAA Compliance)
    ENCRYPTION_KEY: str = Field(
        default="your-encryption-key-change-in-production",
        description="AES-256 encryption key for PHI data"
    )
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Ensure database URL uses asyncpg driver for async operations"""
        if not v.startswith("postgresql+asyncpg://"):
            # Convert standard postgresql:// to asyncpg
            if v.startswith("postgresql://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to ensure settings are only loaded once.
    """
    return Settings()


# Export settings instance for direct import
settings = get_settings()
