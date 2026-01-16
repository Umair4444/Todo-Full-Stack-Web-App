from fastapi import APIRouter, Depends, HTTPException, Query, Request
from typing import List
from sqlmodel import Session
from uuid import UUID
import uuid
from ..database.database import get_session
from ..models.todo_log_model import TodoLogResponse
from ..services.todo_log_service import get_todo_logs, get_user_logs_count
from ..middleware.auth_middleware import JWTBearer, get_current_user_id


# Create router for todo logs
router = APIRouter()


@router.get("/todos/logs", response_model=List[TodoLogResponse])
def get_todo_logs_endpoint(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    action: str = Query(None),
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Get activity logs for the authenticated user with optional filtering and pagination.
    """
    # Validate action parameter if provided
    if action is not None and action not in ["CREATE", "UPDATE", "DELETE"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="Action must be one of: CREATE, UPDATE, DELETE")

    try:
        user_id_str = get_current_user_id(request)
        user_id = UUID(user_id_str)  # Convert string to UUID
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")

    logs = get_todo_logs(session, user_id, skip, limit, action)

    # Return just the logs array to match frontend expectations
    return logs