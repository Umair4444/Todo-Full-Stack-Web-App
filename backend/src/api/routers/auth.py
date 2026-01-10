# src/api/routers/auth.py - Authentication endpoints

from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import timedelta
import sqlalchemy

from src.db.session import get_db
from src.models.user import User, UserCreate, UserRead
from src.services.auth import create_access_token, validate_and_hash_password
from src.services.auth.validation import validate_password_strength
from src.services.user import create_user, authenticate_user
from src.middleware.auth import JWTBearer, get_current_user
from src.core.config import settings


router = APIRouter()


@router.post("/register", response_model=UserRead)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    try:
        # Create the user using the service (validation happens inside)
        db_user = create_user(user_create=user, db_session=db)

        return db_user
    except ValueError as ve:
        # Handle password validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle other errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """Authenticate user and return access token."""
    user = authenticate_user(email=form_data.username, password=form_data.password, db_session=db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    """Logout user (client-side token invalidation)."""
    # In a real implementation, you might add the token to a blacklist
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead, dependencies=[Depends(JWTBearer())])
async def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return current_user