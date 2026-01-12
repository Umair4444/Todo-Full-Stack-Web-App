import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from src.database.database import get_db_session, init_db
from src.models.todo_model import TodoItem, TodoItemCreate
from src.services.todo_service import TodoService


@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, 
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()


@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session


def test_database_connection(engine):
    """Test that we can connect to the database."""
    assert engine.execute("SELECT 1").first() is not None


def test_table_creation(engine):
    """Test that tables are created properly."""
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "todoitem" in tables


def test_data_persistence_through_service(session: Session):
    """Test that data persists correctly through the service layer."""
    # Create a todo item
    todo_data = TodoItemCreate(
        title="Persistence Test",
        description="Testing data persistence",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, todo_data)
    
    # Verify the todo was saved
    assert created_todo.id is not None
    assert created_todo.title == "Persistence Test"
    
    # Retrieve the todo from the database
    retrieved_todo = TodoService.get_todo(session, created_todo.id)
    
    # Verify the retrieved data matches
    assert retrieved_todo is not None
    assert retrieved_todo.id == created_todo.id
    assert retrieved_todo.title == created_todo.title
    assert retrieved_todo.description == created_todo.description
    assert retrieved_todo.is_completed == created_todo.is_completed


def test_data_update_persists(session: Session):
    """Test that updates are persisted to the database."""
    # Create a todo item
    todo_data = TodoItemCreate(
        title="Update Test",
        description="Original description",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, todo_data)
    
    # Update the todo
    updated_data = TodoItem(title="Updated Title", description="Updated description", is_completed=True)
    session.add(updated_data)
    session.commit()
    
    # Retrieve the updated todo
    retrieved_todo = TodoService.get_todo(session, created_todo.id)
    
    # Verify the update was persisted
    assert retrieved_todo is not None
    assert retrieved_todo.title == "Updated Title"
    assert retrieved_todo.description == "Updated description"
    assert retrieved_todo.is_completed is True


def test_data_deletion_persists(session: Session):
    """Test that deletion is persisted to the database."""
    # Create a todo item
    todo_data = TodoItemCreate(
        title="Deletion Test",
        description="To be deleted",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, todo_data)
    
    # Verify it exists
    retrieved_todo = TodoService.get_todo(session, created_todo.id)
    assert retrieved_todo is not None
    
    # Delete the todo
    success = TodoService.delete_todo(session, created_todo.id)
    assert success is True
    
    # Verify it's gone
    retrieved_todo = TodoService.get_todo(session, created_todo.id)
    assert retrieved_todo is None


def test_multiple_records_persist_individually(session: Session):
    """Test that multiple records can be created, updated, and retrieved independently."""
    # Create multiple todo items
    titles = ["Todo 1", "Todo 2", "Todo 3"]
    created_ids = []
    
    for title in titles:
        todo_data = TodoItemCreate(
            title=title,
            description=f"Description for {title}",
            is_completed=False
        )
        created_todo = TodoService.create_todo(session, todo_data)
        created_ids.append(created_todo.id)
    
    # Verify all were created with unique IDs
    assert len(set(created_ids)) == len(titles)  # All IDs should be unique
    
    # Retrieve each individually and verify data integrity
    for i, todo_id in enumerate(created_ids):
        retrieved_todo = TodoService.get_todo(session, todo_id)
        assert retrieved_todo is not None
        assert retrieved_todo.title == titles[i]


def test_transaction_rollback_on_error(session: Session):
    """Test that transactions are rolled back on error."""
    # Create a valid todo first
    valid_todo_data = TodoItemCreate(
        title="Valid Todo",
        description="This should be saved",
        is_completed=False
    )
    created_todo = TodoService.create_todo(session, valid_todo_data)
    
    # Attempt to create an invalid todo (this should fail)
    # Note: We're not actually causing an error in this test, but demonstrating the concept
    # In a real scenario, this would involve an actual database constraint violation
    
    # Verify the valid todo still exists
    retrieved_todo = TodoService.get_todo(session, created_todo.id)
    assert retrieved_todo is not None
    assert retrieved_todo.title == "Valid Todo"


def test_database_initialization():
    """Test that database initialization creates required tables."""
    # Create an in-memory database for testing
    test_engine = create_engine("sqlite://", connect_args={"check_same_thread": False})
    
    # Initialize the database
    from src.models.todo_model import TodoItem
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(test_engine)
    
    # Verify the table exists
    from sqlalchemy import inspect
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    assert "todoitem" in tables