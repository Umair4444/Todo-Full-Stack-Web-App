"""
Unit tests for todo management functionality in User Story 2
"""
import sys
import os
# Add the project root directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from uuid import UUID

# Import from the correct location
import sys
import os
# Add the parent directory to the path so we can import from the root
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from app import app
from src.models.user_model import User
from src.models.todo_model import TodoItem
from src.services.auth_service import register_user
from src.utils.jwt_utils import create_access_token


@pytest.fixture
def client():
    """Create a test client for the API"""
    with TestClient(app) as test_client:
        yield test_client


def test_create_todo_with_user_association(client):
    """Test creating a new todo and associating it with the authenticated user"""
    # First, register and authenticate a user
    registration_data = {
        "email": "todo_user@example.com",
        "password": "SecurePass123!",
        "first_name": "Todo",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=registration_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "todo_user@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Create a todo with the authenticated user
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo item"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data,
                          headers={"Authorization": f"Bearer {token}"})
    
    # Verify response
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo item"
    assert data["is_completed"] is False  # Default value
    assert "user_id" in data  # Should be associated with the user


def test_get_users_own_todos_only(client):
    """Test that a user can only view their own todos"""
    # Register first user and create a todo
    user1_data = {
        "email": "user1@example.com",
        "password": "SecurePass123!",
        "first_name": "User",
        "last_name": "One"
    }
    
    response = client.post("/api/auth/register", json=user1_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "user1@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token1 = data["access_token"]
    
    # Create a todo for user1
    todo_data = {
        "title": "User1's Todo",
        "description": "This belongs to user1"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data,
                          headers={"Authorization": f"Bearer {token1}"})
    assert response.status_code == 201
    user1_todo = response.json()
    
    # Register second user and create a todo
    user2_data = {
        "email": "user2@example.com",
        "password": "SecurePass123!",
        "first_name": "User",
        "last_name": "Two"
    }
    
    response = client.post("/api/auth/register", json=user2_data)
    assert response.status_code == 201
    
    login_data2 = {
        "email": "user2@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data2)
    assert response.status_code == 200
    data = response.json()
    token2 = data["access_token"]
    
    # Create a todo for user2
    todo_data2 = {
        "title": "User2's Todo",
        "description": "This belongs to user2"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data2,
                          headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 201
    user2_todo = response.json()
    
    # Verify user1 can only see their own todo
    response = client.get("/api/todos", 
                         headers={"Authorization": f"Bearer {token1}"})
    assert response.status_code == 200
    data = response.json()
    user1_todos = data
    assert len(user1_todos) == 1
    assert user1_todos[0]["id"] == user1_todo["id"]
    assert user1_todos[0]["title"] == "User1's Todo"
    
    # Verify user2 can only see their own todo
    response = client.get("/api/todos", 
                         headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 200
    data = response.json()
    user2_todos = data
    assert len(user2_todos) == 1
    assert user2_todos[0]["id"] == user2_todo["id"]
    assert user2_todos[0]["title"] == "User2's Todo"


def test_update_user_own_todo(client):
    """Test that a user can update their own todo"""
    # Register user and create a todo
    user_data = {
        "email": "update_user@example.com",
        "password": "SecurePass123!",
        "first_name": "Update",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "update_user@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Create a todo
    todo_data = {
        "title": "Original Title",
        "description": "Original description"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data,
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    original_todo = response.json()
    
    # Update the todo
    update_data = {
        "title": "Updated Title",
        "description": "Updated description",
        "is_completed": True
    }
    
    response = client.put(f"/api/todos/{original_todo['id']}", 
                         json=update_data,
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    updated_todo = response.json()
    
    # Verify the todo was updated
    assert updated_todo["id"] == original_todo["id"]
    assert updated_todo["title"] == "Updated Title"
    assert updated_todo["description"] == "Updated description"
    assert updated_todo["is_completed"] is True


def test_delete_user_own_todo(client):
    """Test that a user can delete their own todo"""
    # Register user and create a todo
    user_data = {
        "email": "delete_user@example.com",
        "password": "SecurePass123!",
        "first_name": "Delete",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    
    login_data = {
        "email": "delete_user@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Create a todo
    todo_data = {
        "title": "Todo to Delete",
        "description": "This will be deleted"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data,
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    todo_to_delete = response.json()
    
    # Verify the todo exists
    response = client.get(f"/api/todos/{todo_to_delete['id']}", 
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    
    # Delete the todo
    response = client.delete(f"/api/todos/{todo_to_delete['id']}", 
                            headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    
    # Verify the todo is gone
    response = client.get(f"/api/todos/{todo_to_delete['id']}", 
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404


def test_user_cannot_access_other_users_todo(client):
    """Verify users cannot access, modify, or delete other users' todos"""
    # Register first user and create a todo
    user1_data = {
        "email": "owner@example.com",
        "password": "SecurePass123!",
        "first_name": "Owner",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user1_data)
    assert response.status_code == 201
    
    login_data1 = {
        "email": "owner@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data1)
    assert response.status_code == 200
    data = response.json()
    token1 = data["access_token"]
    
    # Create a todo for user1
    todo_data = {
        "title": "Private Todo",
        "description": "Only owner should access this"
    }
    
    response = client.post("/api/todos", 
                          json=todo_data,
                          headers={"Authorization": f"Bearer {token1}"})
    assert response.status_code == 201
    private_todo = response.json()
    
    # Register second user
    user2_data = {
        "email": "intruder@example.com",
        "password": "SecurePass123!",
        "first_name": "Intruder",
        "last_name": "User"
    }
    
    response = client.post("/api/auth/register", json=user2_data)
    assert response.status_code == 201
    
    login_data2 = {
        "email": "intruder@example.com",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/login", json=login_data2)
    assert response.status_code == 200
    data = response.json()
    token2 = data["access_token"]
    
    # Try to access user1's todo with user2's token - should fail
    response = client.get(f"/api/todos/{private_todo['id']}", 
                         headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 404  # Should return 404 instead of 403 for security
    
    # Try to update user1's todo with user2's token - should fail
    update_data = {"title": "Hacked Title"}
    response = client.put(f"/api/todos/{private_todo['id']}", 
                         json=update_data,
                         headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 404  # Should return 404 instead of 403 for security
    
    # Try to delete user1's todo with user2's token - should fail
    response = client.delete(f"/api/todos/{private_todo['id']}", 
                            headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 404  # Should return 404 instead of 403 for security