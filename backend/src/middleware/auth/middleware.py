"""
Authentication middleware for protecting routes
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.services.auth import verify_token
from src.db.session import AsyncSessionLocal
from src.services.user.service import get_user_by_email


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        # Get credentials from the request
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )
            
            # Verify the token
            token_payload = verify_token(credentials.credentials)
            if not token_payload:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token or expired token."
                )
                
            # Store user info in request state for later use
            request.state.user_email = token_payload.get("sub")
            request.state.user_id = token_payload.get("user_id")
            
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )


async def get_current_user(request: Request):
    """
    Get the current authenticated user from the request.
    This function can be used as a dependency in route handlers.
    """
    # Check if user info is in the request state
    if not hasattr(request.state, 'user_email') or not request.state.user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    async with AsyncSessionLocal() as session:
        user = await get_user_by_email(email=request.state.user_email, db_session=session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user