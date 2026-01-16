from contextlib import asynccontextmanager
import os
import sys
from pathlib import Path

# Add the src directory to the path so we can import modules
sys.path.append(str(Path(__file__).parent / "src"))

from fastapi import FastAPI
from src.api.todo_router import router as todo_router
from src.api.todo_log_router import router as todo_log_router
from src.api.health_router import router as health_router
from src.middleware.rate_limit import rate_limit_middleware
from src.exception_handlers import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException as FastAPIHTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.monitoring import setup_monitoring

# Import settings to ensure environment variables are loaded
from src.config.settings import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic can go here
    # Initialize the database tables
    from src.database.database import init_db
    init_db()

    yield

    # Shutdown logic can go here
    # Close any database connections if needed
    from src.database.database import engine
    engine.dispose()

app = FastAPI(
    title="Todo Backend API on Hugging Face Spaces",
    version="1.0.0",
    redoc_url="/redoc",
    docs_url="/docs",
    lifespan=lifespan
)

# Add CORS middleware for frontend integration
allowed_origins = ["*"]  # Default to allow all in case environment variable is not set

# Check if we have specific allowed origins from environment variables
if hasattr(settings, 'ALLOWED_ORIGINS') and settings.ALLOWED_ORIGINS:
    allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware
app.middleware("http")(rate_limit_middleware)

# Add exception handlers
app.add_exception_handler(FastAPIHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Set up monitoring and observability
setup_monitoring(app)

# Include routers
app.include_router(todo_router, prefix="/api", tags=["Todos"])
app.include_router(todo_log_router, prefix="/api", tags=["Logs"])
app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Backend API on Hugging Face Spaces"}

# For Hugging Face Spaces, we need to run on the PORT environment variable
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)