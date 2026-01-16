from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum
from sqlalchemy import Column, JSON


class TodoAction(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class TodoLogBase(SQLModel):
    action: TodoAction
    user_id: UUID = Field(foreign_key="user.id", index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    previous_state: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    new_state: Optional[dict] = Field(default=None, sa_column=Column(JSON))


class TodoLog(TodoLogBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    todo_id: Optional[UUID] = Field(default=None, foreign_key="todoitem.id", index=True, ondelete="SET NULL")


class TodoLogCreate(SQLModel):
    action: TodoAction
    todo_id: Optional[UUID] = None
    user_id: UUID
    previous_state: Optional[dict] = None
    new_state: Optional[dict] = None


class TodoLogResponse(SQLModel):
    id: UUID
    action: TodoAction
    todo_id: Optional[UUID]
    user_id: UUID
    timestamp: datetime
    previous_state: Optional[dict]
    new_state: Optional[dict]