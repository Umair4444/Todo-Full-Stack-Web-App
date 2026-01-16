from sqlmodel import Session, select
from src.models.user_model import User, UserCreate
from src.utils.jwt_utils import get_password_hash, verify_password
from typing import Optional
from uuid import UUID


async def register_user(db: Session, user_data: UserCreate) -> User:
    """
    Register a new user with the provided data.
    """
    # Check if user with this email already exists
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise ValueError("Email already registered")
    
    # Create new user
    user = User(
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    # Hash and set the password
    user.set_password(user_data.password)
    
    # Add to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


async def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user with the provided email and password.
    """
    # Find user by email
    user = db.exec(select(User).where(User.email == email)).first()
    
    # Verify user exists and password is correct
    if not user or not user.verify_password(password):
        return None
    
    return user


async def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """
    Retrieve a user by their ID.
    """
    user = db.exec(select(User).where(User.id == user_id)).first()
    return user