# src/api/routers/todos.py - Todo endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

import sqlalchemy
from src.db.session import get_db
from src.models.todo import Todo, TodoCreate, TodoRead, TodoUpdate, TodoToggle
from src.models.user import User
from src.services.auth import oauth2_scheme
from src.middleware.auth import get_current_user
from src.services.todo import (
    create_todo,
    get_todos,
    get_todo_by_id,
    update_todo,
    toggle_todo_completion,
    delete_todo
)


router = APIRouter()


@router.get("/", response_model=List[TodoRead])
async def get_todos_endpoint(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a list of todos for the current user."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to get todos for this user
    todos = get_todos(user_id=str(user_id), skip=skip, limit=limit, db_session=db)
    return todos


@router.post("/", response_model=TodoRead)
async def create_todo_endpoint(
    todo: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new todo for the current user."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to create the todo
    db_todo = create_todo(todo_create=todo, user_id=str(user_id), db_session=db)
    return db_todo


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo_endpoint(
    todo_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific todo by ID for the current user."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to get the specific todo
    todo = get_todo_by_id(todo_id=str(todo_id), user_id=str(user_id), db_session=db)

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo


@router.put("/{todo_id}", response_model=TodoRead)
async def update_todo_endpoint(
    todo_id: UUID,
    todo_update: TodoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a specific todo by ID with version checking for optimistic locking."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to update the todo
    updated_todo = update_todo(
        todo_id=str(todo_id),
        todo_update=todo_update,
        user_id=str(user_id),
        db_session=db
    )

    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return updated_todo


@router.delete("/{todo_id}")
async def delete_todo_endpoint(
    todo_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific todo by ID."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to delete the todo
    success = delete_todo(todo_id=str(todo_id), user_id=str(user_id), db_session=db)

    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")

    return {"message": "Todo deleted successfully"}


@router.patch("/{todo_id}/toggle", response_model=TodoRead)
async def toggle_todo_endpoint(
    todo_id: UUID,
    toggle_data: TodoToggle,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle the completion status of a specific todo."""
    # Get user ID from the authenticated user
    user_id = current_user.id

    # Use the service to toggle the todo
    toggled_todo = toggle_todo_completion(
        todo_id=str(todo_id),
        toggle_data=toggle_data,
        user_id=str(user_id),
        db_session=db
    )

    if not toggled_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return toggled_todo