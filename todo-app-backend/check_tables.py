from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import inspect
from src.config.settings import settings
from src.models.user_model import User
from src.models.todo_model import TodoItem
from src.models.todo_log_model import TodoLog, TodoAction

# Create engine using the same approach as in database.py
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,
    pool_timeout=30,
    pool_reset_on_return='commit'
)

# Check if tables exist
inspector = inspect(engine)
tables = inspector.get_table_names()

print("Existing tables:", tables)

# Create all tables if they don't exist
SQLModel.metadata.create_all(engine)

print("Tables created/reported as existing.")
print("Checking for 'user' table specifically...")
if 'user' in inspector.get_table_names():
    print("✓ User table exists")
else:
    print("✗ User table does not exist")

if 'todoitem' in inspector.get_table_names():
    print("✓ TodoItem table exists")
else:
    print("✗ TodoItem table does not exist")

if 'todolog' in inspector.get_table_names():
    print("✓ TodoLog table exists")
else:
    print("✗ TodoLog table does not exist")