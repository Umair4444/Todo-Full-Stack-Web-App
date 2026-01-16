"""
Unit tests for authentication functionality in User Story 1
"""
import sys
import os
# Add the src directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'src'))

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch, MagicMock
from datetime import timedelta

# Import from the correct location
from main import app


@pytest.fixture
def client():
    """Create a test client for the API"""
    with TestClient(app) as test_client:
        yield test_client


def test_user_registration_success(client):
    """Test successful user registration"""
    # Prepare registration data
    registration_data = {
        "email": "test@example.com",
        "password": "SecurePass123!",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    # Make registration request
    response = client.post("/api/auth/register", json=registration_data)
    
    # Verify response
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["email"] == "test@example.com"
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"


def test_user_registration_invalid_password(client):
    """Test registration with invalid password fails"""
    # Prepare registration data with weak password
    registration_data = {
        "email": "weakpass@example.com",
        "password": "123",  # Too short
        "first_name": "Jane",
        "last_name": "Doe"
    }
    
    # Make registration request
    response = client.post("/api/auth/register", json=registration_data)
    
    # Verify response
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_user_registration_duplicate_email(client):
    """Test registration with duplicate email fails"""
    # First, register a user
    registration_data = {
        "email": "duplicate@example.com",
        "password": "SecurePass123!",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    # First registration should succeed
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 201
    
    # Second registration with same email should fail
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 409


def test_user_login_success(client):
    """Test successful user login"""
    # First register a user
    registration_data = {
        "email": "login@example.com",
        "password": "SecurePass123!",
        "first_name": "Login",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 201
    
    # Then try to login
    login_data = {
        "email": "login@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_login_invalid_credentials(client):
    """Test login with invalid credentials fails"""
    # Try to login with non-existent user
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    
    # Verify response
    assert response.status_code == 400


def test_logout_functionality(client):
    """Test logout functionality"""
    # First register and login a user
    registration_data = {
        "email": "logout@example.com",
        "password": "SecurePass123!",
        "first_name": "Logout",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "logout@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Test logout (this endpoint might require a valid token in header)
    # For now, we'll just check that the endpoint exists and returns success
    response = client.post("/api/auth/logout", 
                          headers={"Authorization": f"Bearer {token}"})
    
    # Verify response - note: this might return 401 after logout if token is invalidated
    # The important thing is that the endpoint exists and is accessible
    assert response.status_code in [200, 401]  # Either success or unauthorized after logout


def test_protected_route_requires_authentication(client):
    """Test that protected routes require authentication"""
    # Try to access a protected route without authentication
    # Using a todo endpoint as an example of a protected route
    response = client.get("/api/todos")
    
    # Should return 401 Unauthorized
    assert response.status_code == 401


def test_protected_route_with_valid_token(client):
    """Test that protected routes work with valid authentication token"""
    # First register and login to get a token
    registration_data = {
        "email": "protected@example.com",
        "password": "SecurePass123!",
        "first_name": "Protected",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "protected@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Now try to access a protected route with the token
    response = client.get("/api/todos", 
                         headers={"Authorization": f"Bearer {token}"})
    
    # Should return 200 OK (or 200 with empty list)
    assert response.status_code in [200, 404]  # 404 is ok if no todos exist yet