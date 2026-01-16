from sqlmodel import create_engine, Session
from ..config.settings import settings
import os
from contextlib import contextmanager
from typing import Generator

# Set environment variable for Neon connection
os.environ["DATABASE_URL"] = settings.DATABASE_URL

# Create engine lazily to ensure settings are loaded
_engine = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.DATABASE_URL,
            echo=False,  # Set to False in production, True for debugging
            pool_pre_ping=True,  # Verify connections before use
            pool_size=5,  # Initial connection pool size
            max_overflow=10,  # Allow some overflow connections
            pool_recycle=300,  # Recycle connections after 5 minutes
            pool_timeout=30,  # Time to wait before raising an error when connecting
            pool_reset_on_return='commit'  # Reset connection on return to pool
        )
    return _engine


# Export the engine for backward compatibility
engine = get_engine()


def get_session() -> Generator[Session, None, None]:
    """
    Generator function to provide database sessions.
    Ensures proper session cleanup after use.
    """
    session = Session(get_engine())
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@contextmanager
def get_db_session():
    """
    Context manager for database sessions with automatic rollback on exception.
    """
    session = Session(get_engine())
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
    from ..models.todo_log_model import TodoLog
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(get_engine())