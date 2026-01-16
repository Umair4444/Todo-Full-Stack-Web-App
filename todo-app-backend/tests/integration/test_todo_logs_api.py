import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app  # Import the FastAPI app
from src.models.todo_model import TodoItem
from src.models.todo_log_model import TodoAction
from src.database.database import get_session
from tests.test_utils import create_test_user_and_auth_headers


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_get_todo_logs_empty(client: TestClient, session: Session):
    """Test getting todo logs when none exist"""
    headers, user_data = create_test_user_and_auth_headers(session, client)

    # Get logs when none exist
    response = client.get("/api/todos/logs", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_todo_logs_with_data(client: TestClient, session: Session):
    """Test getting todo logs after performing some actions"""
    headers, user_data = create_test_user_and_auth_headers(session, client)
    
    # Create a todo item first
    todo_data = {
        "title": "Test Todo for Logging",
        "description": "Testing the logs endpoint",
        "is_completed": False
    }
    response = client.post("/api/todos", json=todo_data, headers=headers)
    assert response.status_code == 200
    created_todo = response.json()
    todo_id = created_todo["id"]
    
    # Update the todo to generate an UPDATE log
    update_data = {
        "title": "Updated Test Todo",
        "description": "Updated description for testing logs",
        "is_completed": True
    }
    response = client.put(f"/api/todos/{todo_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    
    # Delete the todo to generate a DELETE log
    response = client.delete(f"/api/todos/{todo_id}", headers=headers)
    assert response.status_code == 200
    
    # Now get the logs
    response = client.get("/api/todos/logs", headers=headers)
    assert response.status_code == 200
    logs = response.json()
    
    # Should have at least 2 logs (UPDATE and DELETE)
    # Note: CREATE might not be logged depending on implementation
    assert isinstance(logs, list)
    assert len(logs) >= 2
    
    # Verify log structure
    for log in logs:
        assert "id" in log
        assert "action" in log
        assert "todo_id" in log
        assert "user_id" in log
        assert "timestamp" in log
        assert "previous_state" in log
        assert "new_state" in log
        
        # Check that action is one of the valid values
        assert log["action"] in ["CREATE", "UPDATE", "DELETE"]


def test_get_todo_logs_with_action_filter(client: TestClient, session: Session):
    """Test getting todo logs with action filter"""
    headers, user_data = create_test_user_and_auth_headers(session, client)
    
    # Create a todo item first
    todo_data = {
        "title": "Test Todo for Filter",
        "description": "Testing action filter",
        "is_completed": False
    }
    response = client.post("/api/todos", json=todo_data, headers=headers)
    assert response.status_code == 200
    created_todo = response.json()
    todo_id = created_todo["id"]
    
    # Update the todo to generate an UPDATE log
    update_data = {
        "title": "Updated Test Todo",
        "is_completed": True
    }
    response = client.put(f"/api/todos/{todo_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    
    # Delete the todo to generate a DELETE log
    response = client.delete(f"/api/todos/{todo_id}", headers=headers)
    assert response.status_code == 200
    
    # Get only UPDATE logs
    response = client.get("/api/todos/logs?action=UPDATE", headers=headers)
    assert response.status_code == 200
    update_logs = response.json()
    
    # All returned logs should be UPDATE actions
    for log in update_logs:
        assert log["action"] == "UPDATE"
        
    # Get only DELETE logs
    response = client.get("/api/todos/logs?action=DELETE", headers=headers)
    assert response.status_code == 200
    delete_logs = response.json()
    
    # All returned logs should be DELETE actions
    for log in delete_logs:
        assert log["action"] == "DELETE"


def test_get_todo_logs_with_invalid_action(client: TestClient, session: Session):
    """Test getting todo logs with invalid action filter"""
    headers, user_data = create_test_user_and_auth_headers(session, client)
    
    # Try to get logs with invalid action
    response = client.get("/api/todos/logs?action=INVALID", headers=headers)
    assert response.status_code == 422  # Unprocessable Entity due to validation error


def test_get_todo_logs_with_pagination(client: TestClient, session: Session):
    """Test getting todo logs with pagination"""
    headers, user_data = create_test_user_and_auth_headers(session, client)
    
    # Create multiple todo items and perform actions to generate logs
    for i in range(5):
        # Create a todo
        todo_data = {
            "title": f"Test Todo {i}",
            "description": f"Testing pagination {i}",
            "is_completed": False
        }
        response = client.post("/api/todos", json=todo_data, headers=headers)
        assert response.status_code == 200
        created_todo = response.json()
        todo_id = created_todo["id"]
        
        # Update the todo
        update_data = {
            "title": f"Updated Test Todo {i}",
            "is_completed": i % 2 == 0  # Alternate completion status
        }
        response = client.put(f"/api/todos/{todo_id}", json=update_data, headers=headers)
        assert response.status_code == 200
        
        # Delete the todo
        response = client.delete(f"/api/todos/{todo_id}", headers=headers)
        assert response.status_code == 200
    
    # Get first 3 logs (should be most recent)
    response = client.get("/api/todos/logs?skip=0&limit=3", headers=headers)
    assert response.status_code == 200
    first_page = response.json()
    assert len(first_page) == 3
    
    # Get next 3 logs
    response = client.get("/api/todos/logs?skip=3&limit=3", headers=headers)
    assert response.status_code == 200
    second_page = response.json()
    assert len(second_page) == 3
    
    # Ensure no overlap between pages (different logs)
    first_ids = {log["id"] for log in first_page}
    second_ids = {log["id"] for log in second_page}
    assert len(first_ids.intersection(second_ids)) == 0


def test_get_todo_logs_unauthorized(client: TestClient, session: Session):
    """Test getting todo logs without authentication"""
    # Try to get logs without auth headers
    response = client.get("/api/todos/logs")
    # JWT middleware returns 403 for invalid/missing tokens
    assert response.status_code in [401, 403]  # Unauthorized or Forbidden


def test_get_todo_logs_other_user_data(client: TestClient, session: Session):
    """Test that users can only see their own logs"""
    # Create first user
    headers1, user_data1 = create_test_user_and_auth_headers(session, client, "user1@example.com")
    
    # Create second user
    headers2, user_data2 = create_test_user_and_auth_headers(session, client, "user2@example.com")
    
    # User 1 creates a todo
    todo_data = {
        "title": "User 1 Todo",
        "description": "Created by user 1",
        "is_completed": False
    }
    response = client.post("/api/todos", json=todo_data, headers=headers1)
    assert response.status_code == 200
    created_todo = response.json()
    todo_id = created_todo["id"]
    
    # User 1 updates the todo
    update_data = {
        "title": "Updated User 1 Todo",
        "is_completed": True
    }
    response = client.put(f"/api/todos/{todo_id}", json=update_data, headers=headers1)
    assert response.status_code == 200
    
    # User 1 should see their logs
    response = client.get("/api/todos/logs", headers=headers1)
    assert response.status_code == 200
    user1_logs = response.json()
    assert len(user1_logs) >= 1  # At least one log for user 1
    
    # User 2 should see no logs (or different logs if they have their own)
    response = client.get("/api/todos/logs", headers=headers2)
    assert response.status_code == 200
    user2_logs = response.json()
    
    # User 2 should not see user 1's logs
    user1_log_ids = {log["id"] for log in user1_logs}
    user2_log_ids = {log["id"] for log in user2_logs}
    
    # Intersection should be empty (no shared logs)
    assert len(user1_log_ids.intersection(user2_log_ids)) == 0