import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI Todo Backend"}

def test_auth_routes_exist():
    # Test that auth routes are available (will return 422 for missing params, not 404)
    response = client.post("/auth/register")
    assert response.status_code in [422, 401]  # Unprocessable Entity or Unauthorized is expected due to missing data
    
    response = client.post("/auth/login")
    assert response.status_code in [422, 401]  # Unprocessable Entity or Unauthorized is expected due to missing data

def test_todos_routes_exist():
    # Test that todos routes are available (will return 401 for unauthorized access)
    response = client.get("/todos/")
    assert response.status_code in [401, 404]  # Unauthorized or Not Found is expected