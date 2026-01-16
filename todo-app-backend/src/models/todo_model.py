from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


class TodoItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=10000)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="user.id", index=True)  # Link to User
    priority: str = Field(default="low", max_length=20)  # Priority as string: low, medium, high


class TodoItem(TodoItemBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)  # When the todo was marked as completed

    def __setattr__(self, name, value):
        """
        Override to automatically update the updated_at field when model attributes change.
        Also update completed_at when is_completed changes to True.
        """
        if name == 'is_completed' and value and not getattr(self, 'is_completed', False):
            # If is_completed is being set to True and was previously False, update completed_at
            super().__setattr__('completed_at', datetime.utcnow())

        super().__setattr__(name, value)
        if name in ['title', 'description', 'is_completed', 'priority']:
            # Update updated_at when any of these fields change
            super().__setattr__('updated_at', datetime.utcnow())


class TodoItemCreate(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: str = "low"  # Default priority is low


class TodoItemUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None  # Allow priority to be updated


class TodoItemResponse(SQLModel):
    id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    user_id: UUID
    priority: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]