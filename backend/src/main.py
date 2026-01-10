# src/main.py - Main FastAPI application entry point

from fastapi import FastAPI, Request
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
import logging
import time

from src.api.routers import auth, todos
from src.core.config import settings
from src.db.session import engine
from src.models import user, todo  # Import models to register them with SQLModel
from src.middleware.cors import setup_cors
from src.core.logging import setup_logging
from src.middleware.data_validation import add_data_validation_middleware
from src.middleware.rate_limiting.middleware import rate_limit_middleware
from src.logging.logger import app_logger, log_api_call, log_authentication_event, log_security_event
from src.security.audit_logger import audit_logger
from src.security.input_validator import validate_and_sanitize_user_data, validate_and_sanitize_todo_data
import sqlmodel

# Create database tables
sqlmodel.SQLModel.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

# Add rate limiting middleware first
app.middleware("http")(rate_limit_middleware)

# Add security and performance middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set up CORS
setup_cors(app)

# Add data validation middleware
add_data_validation_middleware(app)

# Set up logging
logger = setup_logging(app)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(todos.router, prefix="/todos", tags=["todos"])

# Add exception handlers for better error handling
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    # Log the error
    app_logger.log_error(
        module="API",
        operation=f"{request.method} {request.url.path}",
        details={
            "status_code": exc.status_code,
            "detail": exc.detail,
            "ip_address": request.client.host if request.client else "unknown"
        },
        request_id=request.headers.get("x-request-id")
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Log validation error
    app_logger.log_error(
        module="VALIDATION",
        operation="REQUEST_VALIDATION",
        details={
            "errors": exc.errors(),
            "body": exc.body if hasattr(exc, 'body') else None,
            "ip_address": request.client.host if request.client else "unknown"
        },
        request_id=request.headers.get("x-request-id")
    )

    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    # Log database error
    app_logger.log_error(
        module="DATABASE",
        operation="DATABASE_ERROR",
        details={
            "error": str(exc),
            "ip_address": request.client.host if request.client else "unknown"
        },
        request_id=request.headers.get("x-request-id")
    )

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log general error
    app_logger.log_error(
        module="GENERAL",
        operation="UNHANDLED_EXCEPTION",
        details={
            "error": str(exc),
            "ip_address": request.client.host if request.client else "unknown"
        },
        request_id=request.headers.get("x-request-id")
    )

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "FastAPI Todo Backend"}

@app.get("/health")
def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy", "message": "FastAPI Todo Backend is running"}

# Add middleware to log API calls
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    execution_time = time.time() - start_time

    # Log the API call
    log_api_call(request, response.status_code, execution_time * 1000)  # Convert to ms

    return response