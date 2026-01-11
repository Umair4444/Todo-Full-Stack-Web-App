from sqlmodel import create_engine, Session
from ..config.settings import settings
import os
from contextlib import contextmanager

# Set environment variable for Neon connection
os.environ["DATABASE_URL"] = settings.DATABASE_URL

# Create the database engine with enhanced connection pooling for Neon
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,  # Initial connection pool size
    max_overflow=0,  # Disabled overflow to prevent too many connections
    pool_recycle=300,  # Recycle connections after 5 minutes
    pool_timeout=30,  # Time to wait before raising an error when connecting
    pool_reset_on_return='commit'  # Reset connection on return to pool
)


def get_session():
    with Session(engine) as session:
        yield session


@contextmanager
def get_db_session():
    """
    Context manager for database sessions with automatic rollback on exception.
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db():
    """
    Initialize the database by creating all tables.
    """
    from ..models.todo_model import TodoItem
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(engine)