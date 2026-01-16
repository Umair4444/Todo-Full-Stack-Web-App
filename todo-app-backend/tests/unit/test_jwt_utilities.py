"""
Unit tests for JWT utilities with HS256 algorithm in backend
"""
import pytest
from datetime import timedelta
from jose import jwt
from src.utils.jwt_utils import create_access_token, verify_token
from src.config.settings import settings


def test_create_access_token():
    """Test creating an access token with default expiration"""
    data = {"sub": "test_user", "email": "test@example.com"}
    
    token = create_access_token(data)
    
    # Verify token is created
    assert isinstance(token, str)
    assert len(token) > 0
    
    # Decode token to verify contents
    decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    assert decoded["sub"] == "test_user"
    assert decoded["email"] == "test@example.com"
    assert "exp" in decoded


def test_create_access_token_with_custom_expiration():
    """Test creating an access token with custom expiration time"""
    data = {"sub": "test_user", "email": "test@example.com"}
    expires_delta = timedelta(minutes=30)
    
    token = create_access_token(data, expires_delta=expires_delta)
    
    # Verify token is created
    assert isinstance(token, str)
    assert len(token) > 0
    
    # Decode token to verify contents and expiration
    decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    assert decoded["sub"] == "test_user"
    assert decoded["email"] == "test@example.com"
    
    # Verify expiration is approximately 30 minutes from now
    import time
    expected_exp = time.time() + (30 * 60)  # 30 minutes in seconds
    actual_exp = decoded["exp"]
    
    # Allow for a small time difference
    assert abs(actual_exp - expected_exp) < 5


def test_verify_token_valid():
    """Test verifying a valid token"""
    data = {"sub": "test_user", "email": "test@example.com"}
    
    # Create a token
    token = create_access_token(data)
    
    # Verify the token
    payload = verify_token(token)
    
    # Verify payload contents
    assert payload["sub"] == "test_user"
    assert payload["email"] == "test@example.com"


def test_verify_token_invalid():
    """Test verifying an invalid token raises exception"""
    from fastapi import HTTPException
    
    # Create a malformed token
    invalid_token = "invalid.token.here"
    
    # Verify should raise HTTPException
    with pytest.raises(HTTPException) as exc_info:
        verify_token(invalid_token)
    
    assert exc_info.value.status_code == 401
    assert "Could not validate credentials" in exc_info.value.detail


def test_verify_token_expired():
    """Test verifying an expired token raises exception"""
    from fastapi import HTTPException
    from datetime import datetime
    
    # Create an expired token manually
    expired_data = {
        "sub": "test_user",
        "email": "test@example.com",
        "exp": datetime.utcnow().timestamp() - 3600  # Expired 1 hour ago
    }
    expired_token = jwt.encode(expired_data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    
    # Verify should raise HTTPException
    with pytest.raises(HTTPException) as exc_info:
        verify_token(expired_token)
    
    assert exc_info.value.status_code == 401
    assert "Could not validate credentials" in exc_info.value.detail


def test_password_hashing():
    """Test password hashing and verification utilities"""
    from src.utils.jwt_utils import get_password_hash, verify_password
    
    password = "SecurePassword123!"
    
    # Hash the password
    hashed = get_password_hash(password)
    
    # Verify it's different from original
    assert hashed != password
    assert isinstance(hashed, str)
    
    # Verify the password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False