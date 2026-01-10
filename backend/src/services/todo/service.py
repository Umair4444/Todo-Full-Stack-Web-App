"""
Todo service module for handling todo-related operations
"""

from typing import List, Optional
from sqlmodel import Session, select
from fastapi import HTTPException, status

from src.models.todo import Todo, TodoCreate, TodoUpdate, TodoToggle
from src.models.user import User


def create_todo(*, todo_create: TodoCreate, user_id: str, db_session: Session) -> Todo:
    """
    Create a new todo for a specific user.
    """
    # Create the todo object
    db_todo = Todo(
        title=todo_create.title,
        description=todo_create.description,
        completed=todo_create.completed,
        user_id=user_id  # Associate with the user
    )
    
    # Add to database
    db_session.add(db_todo)
    db_session.commit()
    db_session.refresh(db_todo)
    
    return db_todo


def get_todos(*, user_id: str, skip: int = 0, limit: int = 100, db_session: Session) -> List[Todo]:
    """
    Retrieve a list of todos for a specific user with pagination.
    """
    statement = select(Todo).where(Todo.user_id == user_id).offset(skip).limit(limit)
    todos = db_session.exec(statement).all()
    
    return todos


def get_todo_by_id(*, todo_id: str, user_id: str, db_session: Session) -> Optional[Todo]:
    """
    Retrieve a specific todo by ID for a specific user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    todo = db_session.exec(statement).first()
    
    return todo


def update_todo(*, todo_id: str, todo_update: TodoUpdate, user_id: str, db_session: Session) -> Optional[Todo]:
    """
    Update a specific todo by ID for a specific user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    db_todo = db_session.exec(statement).first()
    
    if not db_todo:
        return None
    
    # Update fields if provided
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    # Increment version for optimistic locking
    db_todo.version += 1
    
    db_session.add(db_todo)
    db_session.commit()
    db_session.refresh(db_todo)
    
    return db_todo


def toggle_todo_completion(*, todo_id: str, toggle_data: TodoToggle, user_id: str, db_session: Session) -> Optional[Todo]:
    """
    Toggle the completion status of a specific todo for a specific user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    db_todo = db_session.exec(statement).first()
    
    if not db_todo:
        return None
    
    # Update completion status
    db_todo.completed = toggle_data.completed
    
    # Increment version for optimistic locking
    db_todo.version += 1
    
    db_session.add(db_todo)
    db_session.commit()
    db_session.refresh(db_todo)
    
    return db_todo


def delete_todo(*, todo_id: str, user_id: str, db_session: Session) -> bool:
    """
    Delete a specific todo by ID for a specific user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    db_todo = db_session.exec(statement).first()
    
    if not db_todo:
        return False
    
    db_session.delete(db_todo)
    db_session.commit()
    
    return True