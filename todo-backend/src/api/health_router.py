import time
from fastapi import APIRouter
from sqlmodel import select
from ..database.database import get_session
from ..models.todo_model import TodoItem

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
def health_check():
    """
    Health check endpoint that verifies the service is running.
    """
    start_time = time.time()

    try:
        # Attempt to connect to the database
        # Using next() to get the session from the generator
        session_gen = get_session()
        session = next(session_gen)
        try:
            # Simple query to check database connectivity
            statement = select(TodoItem).limit(1)
            session.exec(statement)
        finally:
            # Close the session properly
            session.close()

        response_time = round((time.time() - start_time) * 1000, 2)  # in milliseconds

        return {
            "status": "healthy",
            "timestamp": time.time(),
            "response_time_ms": response_time,
            "details": {
                "database": "connected",
                "api": "responsive"
            }
        }
    except Exception as e:
        response_time = round((time.time() - start_time) * 1000, 2)  # in milliseconds
        return {
            "status": "unhealthy",
            "timestamp": time.time(),
            "response_time_ms": response_time,
            "details": {
                "database": "disconnected",
                "error": str(e)
            }
        }, 503