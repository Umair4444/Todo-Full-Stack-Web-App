# src/db/session.py - Database session management

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from src.core.config import settings
import os


# Determine the database URL to use
DATABASE_URL = settings.NEON_DATABASE_URL or settings.DATABASE_URL

# Create the async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create the async session maker
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)


# Dependency to get DB session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session