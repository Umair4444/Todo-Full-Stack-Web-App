from typing import Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    """
    Standard API response format
    """
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[dict] = None


class TodoItemResponseFormat(APIResponse):
    """
    Response format specifically for todo item operations
    """
    data: Optional[dict] = None  # Will contain the todo item data