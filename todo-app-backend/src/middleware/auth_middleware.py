from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.utils.jwt_utils import verify_token
from typing import Optional


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: Optional[HTTPAuthorizationCredentials] = await super(
            JWTBearer, self
        ).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )
            token = credentials.credentials
            token_data = verify_token(token)

            # Add user info to request state for later use
            request.state.user_id = token_data.get("sub")
            request.state.email = token_data.get("email")

            return token
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )


def get_current_user_id(request: Request) -> str:
    """Get the current user ID from the request state."""
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user_id


