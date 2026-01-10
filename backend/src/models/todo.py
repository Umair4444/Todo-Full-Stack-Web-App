# src/models/todo.py - Todo model definition

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class TodoBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: bool = False
    user_id: uuid.UUID


class Todo(TodoBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = Field(default=1)  # For optimistic locking


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    version: int


class TodoUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: Optional[bool] = None


class TodoToggle(SQLModel):
    completed: bool