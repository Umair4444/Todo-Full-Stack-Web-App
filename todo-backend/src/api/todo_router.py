from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlmodel import Session
from ..database.database import get_session
from ..models.todo_model import TodoItemCreate, TodoItemUpdate, TodoItemResponse
from ..services.todo_service import TodoService

router = APIRouter(prefix="/api/v1/todos", tags=["todos"])


@router.get("/", response_model=List[TodoItemResponse])
def get_todos(
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    completed: Optional[bool] = Query(None),
    session: Session = Depends(get_session)
):
    """
    Get a list of todos with optional filtering and pagination.
    """
    todos = TodoService.get_todos(session, offset, limit, completed)
    return todos


@router.post("/", response_model=TodoItemResponse)
def create_todo(
    todo_item: TodoItemCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new todo item.
    """
    return TodoService.create_todo(session, todo_item)


@router.get("/{todo_id}", response_model=TodoItemResponse)
def get_todo(
    todo_id: int,
    session: Session = Depends(get_session)
):
    """
    Get a specific todo item by ID.
    """
    todo = TodoService.get_todo(session, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return todo


@router.put("/{todo_id}", response_model=TodoItemResponse)
def update_todo(
    todo_id: int,
    todo_update: TodoItemUpdate,
    session: Session = Depends(get_session)
):
    """
    Update a specific todo item by ID.
    """
    updated_todo = TodoService.update_todo(session, todo_id, todo_update)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return updated_todo


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo item by ID.
    """
    success = TodoService.delete_todo(session, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return {"message": "Todo item deleted successfully"}


@router.post("/bulk-delete")
def bulk_delete_todos(
    todo_ids: List[int],
    session: Session = Depends(get_session)
):
    """
    Delete multiple todo items by their IDs.
    """
    if not todo_ids:
        raise HTTPException(status_code=400, detail="No todo IDs provided for deletion")

    # Attempt to delete each todo
    deleted_count = 0
    for todo_id in todo_ids:
        success = TodoService.delete_todo(session, todo_id)
        if success:
            deleted_count += 1

    return {
        "message": f"Successfully deleted {deleted_count} out of {len(todo_ids)} todos",
        "deleted_count": deleted_count,
        "requested_count": len(todo_ids)
    }