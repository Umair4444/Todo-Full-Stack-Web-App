"""
Utility functions for tests
"""
from fastapi.testclient import TestClient
from src.models.user_model import UserCreate
from src.services.auth_service import register_user
from src.utils.jwt_utils import create_access_token
from sqlmodel import Session


def create_test_user_and_auth_headers(session: Session, client: TestClient, email: str = "test@example.com"):
    """
    Creates a test user and returns authentication headers for API calls.
    """
    # Register a test user
    registration_data = {
        "email": email,
        "password": "SecurePass123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code in [200, 201], f"Failed to register test user: {response.text}"

    # Extract user data from response
    user_data = response.json()
    user_id = user_data["id"]

    # Create auth headers
    token_data = {"sub": str(user_id), "email": email}
    token = create_access_token(token_data)
    headers = {"Authorization": f"Bearer {token}"}

    return headers, user_data


def get_auth_headers_for_user(client: TestClient, email: str, password: str):
    """
    Gets authentication headers by logging in a user.
    """
    login_data = {
        "email": email,
        "password": password
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200, f"Failed to login test user: {response.text}"
    
    token_data = response.json()
    token = token_data["access_token"]
    
    return {"Authorization": f"Bearer {token}"}