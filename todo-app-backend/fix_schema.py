import asyncio
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from src.config.settings import settings
from src.models.user_model import User
from src.models.todo_model import TodoItem
from src.models.todo_log_model import TodoLog

# Create engine using the same approach as in database.py
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,
    pool_timeout=30,
    pool_reset_on_return='commit'
)

def fix_database_schema():
    print("Connecting to database...")
    
    # Connect and check existing tables
    with engine.connect() as conn:
        # Check existing columns in todoitem table
        result = conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'todoitem' AND column_name = 'id'
        """))
        for row in result:
            print(f"Current todoitem.id type: {row[0]} - {row[1]}")
        
        # Try to drop the foreign key constraint first
        try:
            conn.execute(text("ALTER TABLE todolog DROP CONSTRAINT IF EXISTS todolog_todo_id_fkey"))
            print("Dropped foreign key constraint")
        except Exception as e:
            print(f"Could not drop foreign key constraint: {e}")
        
        # Try to drop the todolog table
        try:
            conn.execute(text("DROP TABLE IF EXISTS todolog"))
            print("Dropped todolog table")
        except Exception as e:
            print(f"Could not drop todolog table: {e}")
        
        # Check if user table exists
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'user'
            )
        """))
        user_table_exists = result.scalar()
        print(f"User table exists: {user_table_exists}")
        
        # Commit the changes
        conn.commit()
    
    # Now try to create all tables with correct schema
    print("Creating tables with correct schema...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    fix_database_schema()