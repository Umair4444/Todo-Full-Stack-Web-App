#!/usr/bin/env python3
"""
Debug script to check database engine initialization order
"""

print("Starting debug script...")

# Import settings first
from src.config.settings import settings
print(f"Settings loaded. DATABASE_URL: {settings.DATABASE_URL}")

# Now import the database module
from src.database.database import engine, init_db
print(f"Database engine created. Engine URL: {engine.url}")

# Test the health check
from src.api.health_router import health_check
print("Calling health check...")
result = health_check()
print(f"Health check result: {result}")