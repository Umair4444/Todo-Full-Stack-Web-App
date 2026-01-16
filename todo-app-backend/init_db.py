"""
Script to initialize the database tables.
"""
from src.database.database import init_db

if __name__ == "__main__":
    print("Initializing database tables...")
    init_db()
    print("Database tables initialized successfully!")