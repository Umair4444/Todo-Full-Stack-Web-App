from sqlmodel import Session
from typing import List, Optional, Dict, Any
from uuid import UUID
import json
from ..models.todo_model import TodoItem, TodoItemCreate, TodoItemUpdate, TodoItemResponse
from ..models.user_model import User
from .todo_service_functions import (
    create_todo_item as create_todo_func,
    get_todo_items as get_todos_func,
    get_todo_item as get_todo_func,
    update_todo_item as update_todo_func,
    delete_todo_item as delete_todo_func
)


def convert_uuids_to_strings(obj: Any) -> Any:
    """
    Recursively convert UUID, datetime, and enum objects to strings in a dictionary/list structure
    to make them JSON serializable.
    """
    if isinstance(obj, dict):
        return {key: convert_uuids_to_strings(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_uuids_to_strings(item) for item in obj]
    elif isinstance(obj, UUID):
        return str(obj)
    elif hasattr(obj, 'isoformat'):  # Handles datetime, date, time objects
        return obj.isoformat()
    elif hasattr(obj, 'value'):  # Handles enum objects
        return obj.value
    else:
        return obj


class TodoService:
    @staticmethod
    def create_todo(db: Session, todo: TodoItemCreate, user_id: UUID) -> TodoItem:
        """
        Create a new todo item for the authenticated user.
        """
        from ..models.todo_model import TodoItem
        from ..models.todo_log_model import TodoLog, TodoAction, TodoLogCreate
        from .todo_log_service import create_todo_log
        from sqlmodel import select

        # Create the todo item with the user ID
        db_todo = TodoItem(
            title=todo.title,
            description=todo.description,
            is_completed=todo.is_completed,
            user_id=user_id,
            priority=todo.priority
        )

        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)

        # Create a log entry for the creation
        new_state_dict = db_todo.model_dump() if hasattr(db_todo, 'model_dump') else db_todo.dict()

        # Convert any UUIDs to strings to make them JSON serializable
        new_state_serializable = convert_uuids_to_strings(new_state_dict)

        log_record = TodoLog(
            action=TodoAction.CREATE,
            todo_id=db_todo.id,
            user_id=user_id,
            new_state=new_state_serializable
        )
        db.add(log_record)
        db.commit()

        return db_todo

    @staticmethod
    def get_todos(
        db: Session,
        user_id: UUID,
        offset: int = 0,
        limit: int = 100,
        completed: Optional[bool] = None
    ) -> List[TodoItem]:
        """
        Get a list of todos with optional filtering and pagination.
        """
        from sqlmodel import select
        from ..models.todo_model import TodoItem

        query = select(TodoItem).where(TodoItem.user_id == user_id)

        # Apply status filter if provided
        if completed is not None:
            query = query.where(TodoItem.is_completed == completed)

        # Apply pagination
        query = query.offset(offset).limit(limit).order_by(TodoItem.created_at.desc())

        todos = db.exec(query).all()
        return todos

    @staticmethod
    def get_todo(db: Session, todo_id: UUID, user_id: UUID) -> Optional[TodoItem]:
        """
        Get a specific todo item by ID.
        """
        from sqlmodel import select
        from ..models.todo_model import TodoItem

        todo = db.exec(
            select(TodoItem).where(
                TodoItem.id == todo_id,
                TodoItem.user_id == user_id
            )
        ).first()
        return todo

    @staticmethod
    def update_todo(
        db: Session,
        todo_id: UUID,
        todo_update: TodoItemUpdate,
        user_id: UUID
    ) -> Optional[TodoItem]:
        """
        Update a specific todo item by ID.
        """
        from sqlmodel import select
        from ..models.todo_model import TodoItem
        from ..models.todo_log_model import TodoLog, TodoAction

        # Get the existing todo
        db_todo = TodoService.get_todo(db, todo_id, user_id)
        if not db_todo:
            return None

        # Store the previous state for logging before any changes
        previous_state = db_todo.model_dump() if hasattr(db_todo, 'model_dump') else db_todo.dict()
        previous_state_serializable = convert_uuids_to_strings(previous_state)

        # Update the todo with the provided values
        update_data = todo_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)

        # Commit the changes to the todo item
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)

        # Create a log entry for the update - only one log entry per update
        new_state = db_todo.model_dump() if hasattr(db_todo, 'model_dump') else db_todo.dict()
        new_state_serializable = convert_uuids_to_strings(new_state)

        log_record = TodoLog(
            action=TodoAction.UPDATE,
            todo_id=db_todo.id,
            user_id=user_id,
            previous_state=previous_state_serializable,
            new_state=new_state_serializable
        )
        db.add(log_record)
        db.commit()

        return db_todo

    @staticmethod
    def delete_todo(db: Session, todo_id: UUID, user_id: UUID) -> bool:
        """
        Delete a specific todo item by ID.
        """
        from sqlmodel import select
        from ..models.todo_model import TodoItem
        from ..models.todo_log_model import TodoLog, TodoAction

        db_todo = TodoService.get_todo(db, todo_id, user_id)
        if not db_todo:
            return False

        # Store the previous state for logging
        previous_state = db_todo.model_dump() if hasattr(db_todo, 'model_dump') else db_todo.dict()
        previous_state_serializable = convert_uuids_to_strings(previous_state)

        # Create a log entry for the deletion
        log_record = TodoLog(
            action=TodoAction.DELETE,
            todo_id=db_todo.id,
            user_id=user_id,
            previous_state=previous_state_serializable
        )
        db.add(log_record)

        # Commit the log entry
        db.commit()

        # Update any existing log entries for this todo to set todo_id to NULL
        # This is needed because the database constraint hasn't been updated yet
        stmt = select(TodoLog).where(TodoLog.todo_id == db_todo.id)
        log_entries = db.exec(stmt).all()
        for log_entry in log_entries:
            log_entry.todo_id = None
            db.add(log_entry)

        # Commit the updates to log entries
        db.commit()

        # Now delete the todo item
        db.delete(db_todo)
        db.commit()

        return True