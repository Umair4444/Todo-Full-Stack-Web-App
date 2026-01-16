from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy import inspect
from src.config.settings import settings
from src.models.user_model import User

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

# Query the user table
with Session(engine) as session:
    users = session.exec(select(User)).all()
    print(f"\nNumber of users in database: {len(users)}")
    
    for user in users:
        print(f"- ID: {user.id}")
        print(f"  Email: {user.email}")
        print(f"  First Name: {user.first_name}")
        print(f"  Last Name: {user.last_name}")
        print(f"  Is Active: {user.is_active}")
        print(f"  Created At: {user.created_at}")
        print(f"  Updated At: {user.updated_at}")
        print()