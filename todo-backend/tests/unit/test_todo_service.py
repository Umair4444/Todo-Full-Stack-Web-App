import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from src.services.todo_service import TodoService
from src.models.todo_model import TodoItem, TodoItemCreate, TodoItemUpdate


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


def test_create_todo(session: Session):
    todo_data = TodoItemCreate(
        title="Test Todo",
        description="Test Description",
        is_completed=False
    )
    result = TodoService.create_todo(session, todo_data)
    
    assert result.title == "Test Todo"
    assert result.description == "Test Description"
    assert result.is_completed is False
    assert result.id is not None


def test_get_todo(session: Session):
    # Create a todo first
    todo_data = TodoItemCreate(
        title="Get Test",
        description="Get Description",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, todo_data)
    
    # Retrieve the todo
    result = TodoService.get_todo(session, created_todo.id)
    
    assert result is not None
    assert result.id == created_todo.id
    assert result.title == "Get Test"


def test_get_nonexistent_todo(session: Session):
    result = TodoService.get_todo(session, 999)
    assert result is None


def test_get_todos(session: Session):
    # Create multiple todos
    todo1 = TodoItemCreate(title="Todo 1", description="Desc 1", is_completed=False)
    todo2 = TodoItemCreate(title="Todo 2", description="Desc 2", is_completed=True)
    
    TodoService.create_todo(session, todo1)
    TodoService.create_todo(session, todo2)
    
    # Get all todos
    result = TodoService.get_todos(session)
    
    assert len(result) == 2


def test_get_todos_with_pagination(session: Session):
    # Create multiple todos
    for i in range(15):
        todo_data = TodoItemCreate(title=f"Todo {i}", description=f"Desc {i}", is_completed=False)
        TodoService.create_todo(session, todo_data)
    
    # Get first 10
    result = TodoService.get_todos(session, offset=0, limit=10)
    assert len(result) == 10
    
    # Get next 5
    result = TodoService.get_todos(session, offset=10, limit=10)
    assert len(result) == 5


def test_get_todos_with_filter(session: Session):
    # Create todos with different completion statuses
    TodoService.create_todo(session, TodoItemCreate(title="Completed", description="Done", is_completed=True))
    TodoService.create_todo(session, TodoItemCreate(title="Incomplete", description="Not done", is_completed=False))
    
    # Get only completed
    result = TodoService.get_todos(session, completed=True)
    assert len(result) == 1
    assert result[0].is_completed is True
    
    # Get only incomplete
    result = TodoService.get_todos(session, completed=False)
    assert len(result) == 1
    assert result[0].is_completed is False


def test_update_todo(session: Session):
    # Create a todo first
    original_data = TodoItemCreate(
        title="Original Title",
        description="Original Description",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, original_data)
    
    # Update the todo
    update_data = TodoItemUpdate(
        title="Updated Title",
        description="Updated Description",
        is_completed=True
    )
    result = TodoService.update_todo(session, created_todo.id, update_data)
    
    assert result is not None
    assert result.title == "Updated Title"
    assert result.description == "Updated Description"
    assert result.is_completed is True


def test_update_nonexistent_todo(session: Session):
    update_data = TodoItemUpdate(title="Updated Title")
    result = TodoService.update_todo(session, 999, update_data)
    assert result is None


def test_delete_todo(session: Session):
    # Create a todo first
    todo_data = TodoItemCreate(title="ToDelete", description="Will be deleted", is_completed=False)
    created_todo = TodoService.create_todo(session, todo_data)
    
    # Delete the todo
    success = TodoService.delete_todo(session, created_todo.id)
    assert success is True
    
    # Verify it's gone
    result = TodoService.get_todo(session, created_todo.id)
    assert result is None


def test_delete_nonexistent_todo(session: Session):
    success = TodoService.delete_todo(session, 999)
    assert success is False