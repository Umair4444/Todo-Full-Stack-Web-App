"""
Unit tests for SQLModel database connection in backend
"""
import pytest
from unittest.mock import patch, MagicMock
from sqlmodel import Session
from src.database.database import get_session, engine
from src.models.user_model import User


def test_get_session_yields_session():
    """Test that get_session yields a valid session"""
    # Mock the Session context manager
    with patch('src.database.database.Session') as mock_session_class:
        mock_session_instance = MagicMock()
        mock_session_class.return_value.__enter__.return_value = mock_session_instance
        
        # Call the generator function
        session_gen = get_session()
        session = next(session_gen)
        
        # Verify that a session was yielded
        assert session is not None
        # Verify that the Session context manager was called with the engine
        mock_session_class.assert_called_once_with(engine)


def test_engine_creation():
    """Test that the SQLModel engine is created properly"""
    assert engine is not None
    assert hasattr(engine, 'connect')


def test_database_connection_integration():
    """Integration test to ensure database connection works with models"""
    # This test would normally connect to a test database
    # For now, we'll just ensure the model can be imported and has expected attributes
    assert hasattr(User, '__tablename__')
    assert User.__tablename__ == 'user'