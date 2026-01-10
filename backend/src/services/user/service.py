"""
User service module for handling user-related operations
"""

from typing import Optional
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from src.models.user import User, UserCreate, UserUpdate
from src.services.auth import get_password_hash, verify_password, validate_and_hash_password


def create_user(*, user_create: UserCreate, db_session: Session) -> User:
    """
    Create a new user in the database.
    """
    # Validate and hash the password
    hashed_password = validate_and_hash_password(user_create.password)

    # Create the user object
    db_user = User(
        email=user_create.email,
        name=user_create.name,
        hashed_password=hashed_password
    )

    try:
        # Add to database
        db_session.add(db_user)
        db_session.commit()
        db_session.refresh(db_user)

        return db_user
    except IntegrityError:
        # Email already exists
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )


def authenticate_user(*, email: str, password: str, db_session: Session) -> Optional[User]:
    """
    Authenticate a user by email and password.
    Returns the user object if authentication is successful, None otherwise.
    """
    # Find user by email
    statement = select(User).where(User.email == email)
    user = db_session.exec(statement).first()
    
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    return user


def get_user_by_email(*, email: str, db_session: Session) -> Optional[User]:
    """
    Retrieve a user by email.
    """
    statement = select(User).where(User.email == email)
    user = db_session.exec(statement).first()
    
    return user


def get_user_by_id(*, user_id: str, db_session: Session) -> Optional[User]:
    """
    Retrieve a user by ID.
    """
    statement = select(User).where(User.id == user_id)
    user = db_session.exec(statement).first()
    
    return user


def update_user(*, user_id: str, user_update: UserUpdate, db_session: Session) -> Optional[User]:
    """
    Update a user's information.
    """
    statement = select(User).where(User.id == user_id)
    db_user = db_session.exec(statement).first()
    
    if not db_user:
        return None
    
    # Update fields if provided
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    
    return db_user


def delete_user(*, user_id: str, db_session: Session) -> bool:
    """
    Delete a user by ID.
    """
    statement = select(User).where(User.id == user_id)
    db_user = db_session.exec(statement).first()
    
    if not db_user:
        return False
    
    db_session.delete(db_user)
    db_session.commit()
    
    return True