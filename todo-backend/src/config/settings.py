from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import Field


class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., description="Database connection URL")
    SECRET_KEY: str = Field("your-secret-key-here", description="Secret key for JWT tokens")
    ALGORITHM: str = Field("HS256", description="Algorithm for JWT encoding")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, description="Token expiration time in minutes")
    TEST_DATABASE_URL: Optional[str] = Field(None, description="Test database connection URL")
    ALLOWED_ORIGINS: Optional[str] = Field(None, description="Comma-separated list of allowed origins for CORS")

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields that are not defined in the model


settings = Settings()