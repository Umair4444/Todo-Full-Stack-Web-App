from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class TodoItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)


class TodoItem(TodoItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Update updated_at on modification
    def __setattr__(self, name, value):
        if name == 'updated_at':
            # Prevent manual setting of updated_at
            super().__setattr__('updated_at', datetime.utcnow())
        else:
            super().__setattr__(name, value)
            if name in ['title', 'description', 'is_completed']:
                # Update updated_at when any of these fields change
                super().__setattr__('updated_at', datetime.utcnow())


class TodoItemCreate(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class TodoItemUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TodoItemResponse(SQLModel):
    id: int
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime