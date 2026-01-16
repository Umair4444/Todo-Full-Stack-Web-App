"""
Script to reset the database schema to ensure user login functionality works properly.
This will recreate all tables with the correct UUID-based schema.
"""

from sqlalchemy import create_engine, text
from src.config.settings import settings
from src.models.user_model import User
from src.models.todo_model import TodoItem
from src.models.todo_log_model import TodoLog
from sqlmodel import SQLModel


def reset_database_schema():
    # Create engine
    engine = create_engine(settings.DATABASE_URL)
    
    print("Resetting database schema...")
    
    with engine.connect() as conn:
        # Drop all existing tables
        # Note: We need to handle foreign key constraints properly
        conn.execute(text("DROP TABLE IF EXISTS todolog CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS todoitem CASCADE")) 
        conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE"))  # user is a reserved word in SQL, so quote it
        
        # Commit the drops
        conn.commit()
        
        # Create all tables with correct schema
        SQLModel.metadata.create_all(conn)
        
        # Commit the creations
        conn.commit()
        
    print("Database schema reset successfully!")
    print("- User table created with UUID id")
    print("- TodoItem table created with UUID id") 
    print("- TodoLog table created with UUID foreign keys")
    print("User registration and login should now work properly.")


if __name__ == "__main__":
    reset_database_schema()