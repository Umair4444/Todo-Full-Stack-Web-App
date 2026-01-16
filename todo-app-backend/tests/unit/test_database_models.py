"""
Unit tests for User, Todo, and TodoLog database models in backend
"""
import pytest
from uuid import UUID
from datetime import datetime
from sqlmodel import Session
from unittest.mock import patch
from src.models.user_model import User, UserCreate, UserUpdate, UserResponse
from src.models.todo_model import TodoItem, TodoItemCreate, TodoItemUpdate, TodoItemResponse
from src.models.todo_log_model import TodoLog, TodoAction, TodoLogCreate, TodoLogResponse


def test_user_model_creation():
    """Test creating a User model instance"""
    user_data = {
        "email": "test@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_active": True
    }
    
    # Create user instance
    user = User(**user_data)
    
    # Verify attributes
    assert user.email == "test@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.is_active is True
    assert user.id is not None  # Should be auto-generated
    assert isinstance(user.id, UUID)
    assert isinstance(user.created_at, datetime)
    assert isinstance(user.updated_at, datetime)


def test_user_set_password():
    """Test setting and verifying password on User model"""
    user = User(
        email="test@example.com",
        first_name="John",
        last_name="Doe"
    )
    
    password = "SecurePassword123!"
    
    # Set password
    user.set_password(password)
    
    # Verify password is hashed
    assert user.password_hash is not None
    assert user.password_hash != password  # Should be hashed, not plain text
    
    # Verify password verification works
    assert user.verify_password(password) is True
    assert user.verify_password("WrongPassword!") is False


def test_user_verify_password():
    """Test password verification on User model"""
    user = User(
        email="test@example.com",
        first_name="John",
        last_name="Doe"
    )
    
    password = "SecurePassword123!"
    wrong_password = "WrongPassword!"
    
    user.set_password(password)
    
    # Verify correct password returns True
    assert user.verify_password(password) is True
    
    # Verify wrong password returns False
    assert user.verify_password(wrong_password) is False


def test_user_create_schema():
    """Test UserCreate schema validation"""
    user_create_data = {
        "email": "create@example.com",
        "password": "SecurePass123!",
        "first_name": "Jane",
        "last_name": "Doe"
    }
    
    user_create = UserCreate(**user_create_data)
    
    assert user_create.email == "create@example.com"
    assert user_create.password == "SecurePass123!"
    assert user_create.first_name == "Jane"
    assert user_create.last_name == "Doe"


def test_user_update_schema():
    """Test UserUpdate schema validation"""
    user_update_data = {
        "email": "update@example.com",
        "first_name": "Updated",
        "is_active": False
    }
    
    user_update = UserUpdate(**user_update_data)
    
    assert user_update.email == "update@example.com"
    assert user_update.first_name == "Updated"
    assert user_update.is_active is False


def test_user_response_schema():
    """Test UserResponse schema validation"""
    from uuid import uuid4
    
    user_response_data = {
        "id": uuid4(),
        "email": "response@example.com",
        "first_name": "Response",
        "last_name": "User",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    user_response = UserResponse(**user_response_data)
    
    assert user_response.id == user_response_data["id"]
    assert user_response.email == "response@example.com"
    assert user_response.first_name == "Response"
    assert user_response.last_name == "User"
    assert user_response.is_active is True
    assert user_response.created_at == user_response_data["created_at"]
    assert user_response.updated_at == user_response_data["updated_at"]


def test_todo_item_creation():
    """Test creating a TodoItem model instance"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo_data = {
        "title": "Test Todo",
        "description": "Test Description",
        "is_completed": False,
        "user_id": user_id,
        "priority": "medium"
    }
    
    todo = TodoItem(**todo_data)
    
    assert todo.title == "Test Todo"
    assert todo.description == "Test Description"
    assert todo.is_completed is False
    assert todo.user_id == user_id
    assert todo.priority == "medium"
    assert isinstance(todo.id, UUID)
    assert isinstance(todo.created_at, datetime)
    assert isinstance(todo.updated_at, datetime)


def test_todo_item_auto_update_timestamp():
    """Test that TodoItem automatically updates the updated_at field"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo = TodoItem(
        title="Test Todo",
        description="Test Description",
        is_completed=False,
        user_id=user_id,
        priority="medium"
    )
    
    original_updated_at = todo.updated_at
    
    # Simulate changing a field that should trigger the __setattr__ override
    import time
    time.sleep(0.001)  # Small delay to ensure different timestamp
    todo.title = "Updated Title"
    
    # The updated_at field should have been updated
    assert todo.updated_at > original_updated_at


def test_todo_item_completed_at_update():
    """Test that TodoItem updates completed_at when is_completed is set to True"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo = TodoItem(
        title="Test Todo",
        description="Test Description",
        is_completed=False,
        user_id=user_id,
        priority="medium"
    )
    
    # Initially, completed_at should be None
    assert todo.completed_at is None
    
    # When we set is_completed to True, completed_at should be set
    import time
    time.sleep(0.001)  # Small delay to ensure different timestamp
    todo.is_completed = True
    
    # completed_at should now be set to a datetime value
    assert todo.completed_at is not None
    assert isinstance(todo.completed_at, datetime)
    assert todo.completed_at >= todo.updated_at  # completed_at should be >= updated_at


def test_todo_item_create_schema():
    """Test TodoItemCreate schema validation"""
    todo_create_data = {
        "title": "Create Test",
        "description": "Test creating a todo",
        "is_completed": False,
        "priority": "high"
    }
    
    todo_create = TodoItemCreate(**todo_create_data)
    
    assert todo_create.title == "Create Test"
    assert todo_create.description == "Test creating a todo"
    assert todo_create.is_completed is False
    assert todo_create.priority == "high"


def test_todo_item_update_schema():
    """Test TodoItemUpdate schema validation"""
    todo_update_data = {
        "title": "Updated Title",
        "is_completed": True,
        "priority": "low"
    }
    
    todo_update = TodoItemUpdate(**todo_update_data)
    
    assert todo_update.title == "Updated Title"
    assert todo_update.is_completed is True
    assert todo_update.priority == "low"


def test_todo_item_response_schema():
    """Test TodoItemResponse schema validation"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo_id = uuid4()
    
    todo_response_data = {
        "id": todo_id,
        "title": "Response Test",
        "description": "Test response schema",
        "is_completed": False,
        "user_id": user_id,
        "priority": "medium",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "completed_at": None
    }
    
    todo_response = TodoItemResponse(**todo_response_data)
    
    assert todo_response.id == todo_id
    assert todo_response.title == "Response Test"
    assert todo_response.description == "Test response schema"
    assert todo_response.is_completed is False
    assert todo_response.user_id == user_id
    assert todo_response.priority == "medium"
    assert todo_response.created_at == todo_response_data["created_at"]
    assert todo_response.updated_at == todo_response_data["updated_at"]
    assert todo_response.completed_at is None


def test_todo_log_creation():
    """Test creating a TodoLog model instance"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo_id = uuid4()
    log_data = {
        "action": TodoAction.CREATE,
        "user_id": user_id,
        "todo_id": todo_id,
        "previous_state": {"title": "Old Title"},
        "new_state": {"title": "New Title"}
    }
    
    log = TodoLog(**log_data)
    
    assert log.action == TodoAction.CREATE
    assert log.user_id == user_id
    assert log.todo_id == todo_id
    assert log.previous_state == {"title": "Old Title"}
    assert log.new_state == {"title": "New Title"}
    assert isinstance(log.id, UUID)
    assert isinstance(log.timestamp, datetime)


def test_todo_log_create_schema():
    """Test TodoLogCreate schema validation"""
    from uuid import uuid4
    
    user_id = uuid4()
    todo_id = uuid4()
    
    log_create_data = {
        "action": TodoAction.UPDATE,
        "todo_id": todo_id,
        "user_id": user_id,
        "previous_state": {"title": "Old Title"},
        "new_state": {"title": "New Title"}
    }
    
    log_create = TodoLogCreate(**log_create_data)
    
    assert log_create.action == TodoAction.UPDATE
    assert log_create.todo_id == todo_id
    assert log_create.user_id == user_id
    assert log_create.previous_state == {"title": "Old Title"}
    assert log_create.new_state == {"title": "New Title"}


def test_todo_log_response_schema():
    """Test TodoLogResponse schema validation"""
    from uuid import uuid4
    
    log_id = uuid4()
    user_id = uuid4()
    todo_id = uuid4()
    
    log_response_data = {
        "id": log_id,
        "action": TodoAction.DELETE,
        "todo_id": todo_id,
        "user_id": user_id,
        "timestamp": datetime.utcnow(),
        "previous_state": None,
        "new_state": None
    }
    
    log_response = TodoLogResponse(**log_response_data)
    
    assert log_response.id == log_id
    assert log_response.action == TodoAction.DELETE
    assert log_response.todo_id == todo_id
    assert log_response.user_id == user_id
    assert log_response.timestamp == log_response_data["timestamp"]
    assert log_response.previous_state is None
    assert log_response.new_state is None


def test_todo_action_enum_values():
    """Test that TodoAction enum has the correct values"""
    assert TodoAction.CREATE.value == "CREATE"
    assert TodoAction.UPDATE.value == "UPDATE"
    assert TodoAction.DELETE.value == "DELETE"
    
    # Test that we can create actions from strings
    assert TodoAction("CREATE") == TodoAction.CREATE
    assert TodoAction("UPDATE") == TodoAction.UPDATE
    assert TodoAction("DELETE") == TodoAction.DELETE