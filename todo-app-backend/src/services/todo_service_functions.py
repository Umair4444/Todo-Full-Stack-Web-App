from sqlmodel import Session, select, func
from typing import List, Optional
from uuid import UUID
from ..models.todo_model import TodoItem, TodoItemCreate, TodoItemUpdate
from ..models.todo_log_model import TodoLog, TodoAction, TodoLogCreate
from ..models.user_model import User
from .todo_log_service import create_todo_log


async def create_todo_item(db: Session, todo: TodoItemCreate, user_id: UUID) -> TodoItem:
    """
    Create a new todo item for the authenticated user.
    """
    # Create the todo item with the user ID
    db_todo = TodoItem.from_orm(todo) if hasattr(TodoItem, 'from_orm') else TodoItem(**todo.dict())
    db_todo.user_id = user_id

    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    # Create a log entry for the creation
    log_entry = TodoLogCreate(
        action=TodoAction.CREATE,
        todo_id=db_todo.id,
        user_id=user_id,
        new_state=db_todo.dict()
    )
    await create_todo_log(db, log_entry)

    return db_todo


async def get_todo_items(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> List[TodoItem]:
    """
    Retrieve todo items for the authenticated user with optional filtering.
    """
    query = select(TodoItem).where(TodoItem.user_id == user_id)

    # Apply status filter if provided
    if status:
        if status == "active":
            query = query.where(TodoItem.is_completed == False)
        elif status == "completed":
            query = query.where(TodoItem.is_completed == True)

    # Apply pagination
    query = query.offset(skip).limit(limit).order_by(TodoItem.created_at.desc())

    todos = db.exec(query).all()
    return todos


async def get_todo_item(db: Session, todo_id: UUID, user_id: UUID) -> Optional[TodoItem]:
    """
    Retrieve a specific todo item by ID for the authenticated user.
    """
    todo = db.exec(
        select(TodoItem).where(
            TodoItem.id == todo_id,
            TodoItem.user_id == user_id
        )
    ).first()
    return todo


async def update_todo_item(
    db: Session,
    todo_id: UUID,
    todo_update: TodoItemUpdate,
    user_id: UUID
) -> Optional[TodoItem]:
    """
    Update a specific todo item for the authenticated user.
    """
    # Get the existing todo
    db_todo = await get_todo_item(db, todo_id, user_id)
    if not db_todo:
        return None

    # Store the previous state for logging
    previous_state = db_todo.dict()

    # Update the todo with the provided values
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    # Create a log entry for the update
    log_entry = TodoLogCreate(
        action=TodoAction.UPDATE,
        todo_id=db_todo.id,
        user_id=user_id,
        previous_state=previous_state,
        new_state=db_todo.dict()
    )
    await create_todo_log(db, log_entry)

    return db_todo


async def delete_todo_item(db: Session, todo_id: UUID, user_id: UUID) -> bool:
    """
    Delete a specific todo item for the authenticated user.
    """
    db_todo = await get_todo_item(db, todo_id, user_id)
    if not db_todo:
        return False

    # Store the state before deletion for logging
    previous_state = db_todo.dict()

    db.delete(db_todo)
    db.commit()

    # Create a log entry for the deletion
    log_entry = TodoLogCreate(
        action=TodoAction.DELETE,
        todo_id=db_todo.id,
        user_id=user_id,
        previous_state=previous_state
    )
    await create_todo_log(db, log_entry)

    return True


async def get_user_todos_count(db: Session, user_id: UUID) -> int:
    """
    Get the total count of todos for a user.
    """
    count = db.exec(
        select(func.count(TodoItem.id)).where(TodoItem.user_id == user_id)
    ).one()
    return count