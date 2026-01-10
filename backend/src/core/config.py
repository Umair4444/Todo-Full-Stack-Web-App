# src/core/config.py - Application configuration

from pydantic_settings import Settings
from typing import Optional


class Settings(Settings):
    APP_NAME: str = "FastAPI Todo Backend"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "A todo application backend built with FastAPI"
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Auth
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Neon PostgreSQL
    NEON_DATABASE_URL: Optional[str] = None
    
    # Better Auth
    AUTH_SECRET: Optional[str] = None


settings = Settings()