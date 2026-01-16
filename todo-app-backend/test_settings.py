from src.config.settings import settings

print("Current DATABASE_URL from settings:")
print(settings.DATABASE_URL)
print()

# Also test importing the database module to see if it creates the engine correctly
try:
    from src.database.database import engine
    print(f"Engine URL: {engine.url}")
except Exception as e:
    print(f"Error creating engine: {e}")