from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import Field
import os


class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = Field(..., description="Database connection URL")

    # JWT Configuration
    JWT_SECRET: str = Field(..., description="Secret key for JWT tokens")
    JWT_ALGORITHM: str = Field("HS256", description="Algorithm for JWT encoding")
    JWT_EXPIRATION_DELTA: int = Field(86400, description="JWT token expiration in seconds (default 24 hours)")

    # Legacy token settings (for compatibility)
    SECRET_KEY: str = Field("your-secret-key-here", description="Secret key for JWT tokens")
    ALGORITHM: str = Field("HS256", description="Algorithm for JWT encoding")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, description="Token expiration time in minutes")

    # CORS settings
    ALLOWED_ORIGINS: Optional[str] = Field(None, description="Comma-separated list of allowed origins for CORS")

    # Rate limiting settings
    RATE_LIMIT_MAX_REQUESTS: int = Field(1000, description="Maximum number of requests allowed per window")
    RATE_LIMIT_WINDOW_SECONDS: int = Field(3600, description="Time window in seconds for rate limiting")

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields that are not defined in the model


# Initialize settings
settings = Settings()