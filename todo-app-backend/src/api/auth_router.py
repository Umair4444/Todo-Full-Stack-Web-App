from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import Any
from pydantic import BaseModel
from src.database.database import get_session
from src.models.user_model import UserCreate, UserResponse
from src.services.auth_service import register_user, authenticate_user
from src.utils.jwt_utils import create_access_token
from src.utils.validation_utils import validate_registration_data
from datetime import timedelta


router = APIRouter()

security = HTTPBearer()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_session)
) -> Any:
    """
    Register a new user.
    """
    # Validate registration data
    validation_result = validate_registration_data(
        email=user_data.email,
        password=user_data.password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )

    if not validation_result["is_valid"]:
        # Format error messages for response
        error_messages = []
        for field, errors in validation_result["errors"].items():
            error_messages.extend([f"{field}: {error}" for error in errors])

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(error_messages)
        )

    try:
        user = await register_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.post("/login")
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_session)
) -> Any:
    """
    Authenticate user and return JWT token.
    """
    email = login_request.email
    password = login_request.password

    user = await authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )

    # Create access token
    access_token_expires = timedelta(seconds=86400)  # 24 hours
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(token: str = Depends(security)) -> Any:
    """
    Logout user (invalidate session).
    """
    # In a real implementation, you might add the token to a blacklist
    # For now, we just return a success message
    return {"message": "Successfully logged out"}