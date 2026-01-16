from fastapi import APIRouter, Depends, HTTPException, Query, Request
from typing import List, Optional
from sqlmodel import Session
from pydantic import BaseModel
from uuid import UUID
import uuid
from ..database.database import get_session
from ..models.todo_model import TodoItemCreate, TodoItemUpdate, TodoItemResponse
from ..services.todo_service import TodoService
from ..middleware.auth_middleware import JWTBearer, get_current_user_id


class BulkDeleteRequest(BaseModel):
    todo_ids: List[UUID]

# Create router with prefix as originally intended
router = APIRouter()


@router.get("/todos", response_model=List[TodoItemResponse])
def get_todos(
    request: Request,                   # This gives us access to the request with user info
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    completed: Optional[bool] = Query(None),
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Get a list of todos with optional filtering and pagination.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    todos = TodoService.get_todos(session, user_id, offset, limit, completed)
    return todos


@router.post("/todos", response_model=TodoItemResponse)
def create_todo(
    request: Request,                   # This gives us access to the request with user info
    todo_item: TodoItemCreate,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Create a new todo item.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    return TodoService.create_todo(session, todo_item, user_id)


@router.get("/todos/{todo_id}", response_model=TodoItemResponse)
def get_todo(
    request: Request,                   # This gives us access to the request with user info
    todo_id: UUID,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Get a specific todo item by ID.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    todo = TodoService.get_todo(session, todo_id, user_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return todo


@router.put("/todos/{todo_id}", response_model=TodoItemResponse)
def update_todo(
    request: Request,                   # This gives us access to the request with user info
    todo_id: UUID,
    todo_update: TodoItemUpdate,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Update a specific todo item by ID.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    updated_todo = TodoService.update_todo(session, todo_id, todo_update, user_id)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return updated_todo


@router.delete("/todos/{todo_id}")
def delete_todo(
    request: Request,                   # This gives us access to the request with user info
    todo_id: UUID,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo item by ID.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    success = TodoService.delete_todo(session, todo_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return {"message": "Todo item deleted successfully"}


@router.patch("/todos/{todo_id}/toggle-completion")
def toggle_completion(
    request: Request,                   # This gives us access to the request with user info
    todo_id: UUID,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a todo item.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID

    # Get the current todo
    current_todo = TodoService.get_todo(session, todo_id, user_id)
    if not current_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")

    # Update the completion status
    updated_todo = TodoService.update_todo(
        session,
        todo_id,
        TodoItemUpdate(is_completed=not current_todo.is_completed),
        user_id
    )

    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")

    return updated_todo


@router.post("/todos/bulk-delete")
def bulk_delete_todos(
    request: Request,                   # This gives us access to the request with user info
    bulk_request: BulkDeleteRequest,
    token: str = Depends(JWTBearer()),  # This ensures authentication
    session: Session = Depends(get_session)
):
    """
    Delete multiple todo items by their IDs.
    Requires authentication.
    """
    user_id_str = get_current_user_id(request)
    user_id = UUID(user_id_str)  # Convert string to UUID
    todo_ids = bulk_request.todo_ids

    if not todo_ids:
        raise HTTPException(status_code=400, detail="No todo IDs provided for deletion")

    # Attempt to delete each todo
    deleted_count = 0
    for todo_id in todo_ids:
        success = TodoService.delete_todo(session, todo_id, user_id)
        if success:
            deleted_count += 1

    return {
        "message": f"Successfully deleted {deleted_count} out of {len(todo_ids)} todos",
        "deleted_count": deleted_count,
        "requested_count": len(todo_ids)
    }