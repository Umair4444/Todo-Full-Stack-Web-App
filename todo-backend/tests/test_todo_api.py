import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app  # Import the FastAPI app
from src.models.todo_model import TodoItem
from src.database.database import get_session


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


def test_create_todo(client: TestClient):
    todo_data = {
        "title": "Test Todo",
        "description": "Test Description",
        "is_completed": False
    }
    response = client.post("/api/v1/todos/", json=todo_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert data["is_completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_get_todos(client: TestClient, session: Session):
    # Create test todos
    todo1 = TodoItem(title="Todo 1", description="Description 1", is_completed=False)
    todo2 = TodoItem(title="Todo 2", description="Description 2", is_completed=True)
    session.add(todo1)
    session.add(todo2)
    session.commit()

    # Test getting all todos
    response = client.get("/api/v1/todos/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_todo_by_id(client: TestClient, session: Session):
    # Create a test todo
    todo = TodoItem(title="Single Todo", description="Single Description", is_completed=False)
    session.add(todo)
    session.commit()

    # Test getting the todo by ID
    response = client.get(f"/api/v1/todos/{todo.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == todo.id
    assert data["title"] == "Single Todo"


def test_update_todo(client: TestClient, session: Session):
    # Create a test todo
    todo = TodoItem(title="Original Title", description="Original Description", is_completed=False)
    session.add(todo)
    session.commit()

    # Update the todo
    update_data = {
        "title": "Updated Title",
        "description": "Updated Description",
        "is_completed": True
    }
    response = client.put(f"/api/v1/todos/{todo.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated Description"
    assert data["is_completed"] is True


def test_delete_todo(client: TestClient, session: Session):
    # Create a test todo
    todo = TodoItem(title="Delete Test", description="To be deleted", is_completed=False)
    session.add(todo)
    session.commit()

    # Delete the todo
    response = client.delete(f"/api/v1/todos/{todo.id}")
    assert response.status_code == 200
    
    # Verify the todo is gone
    response = client.get(f"/api/v1/todos/{todo.id}")
    assert response.status_code == 404


def test_pagination(client: TestClient, session: Session):
    # Create multiple test todos
    for i in range(15):
        todo = TodoItem(title=f"Todo {i}", description=f"Description {i}", is_completed=False)
        session.add(todo)
    session.commit()

    # Test pagination with offset and limit
    response = client.get("/api/v1/todos/?offset=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10

    response = client.get("/api/v1/todos/?offset=10&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5  # Remaining todos


def test_filtering(client: TestClient, session: Session):
    # Create test todos with different completion statuses
    todo1 = TodoItem(title="Completed Todo", description="Done", is_completed=True)
    todo2 = TodoItem(title="Incomplete Todo", description="Not done", is_completed=False)
    session.add(todo1)
    session.add(todo2)
    session.commit()

    # Test filtering by completion status
    response = client.get("/api/v1/todos/?completed=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_completed"] is True

    response = client.get("/api/v1/todos/?completed=false")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_completed"] is False