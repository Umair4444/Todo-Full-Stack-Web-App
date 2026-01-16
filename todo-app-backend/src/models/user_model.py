from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
import bcrypt


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, max_length=255)
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str = Field(sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def set_password(self, password: str):
        """Hash and set the user's password."""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Verify the provided password against the stored hash."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))


class UserCreate(UserBase):
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserUpdate(SQLModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(SQLModel):
    id: UUID
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime