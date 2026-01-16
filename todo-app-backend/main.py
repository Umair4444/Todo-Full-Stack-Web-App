from fastapi import FastAPI
from src.api.todo_router import router as todo_router
from src.api.todo_log_router import router as todo_log_router
from src.api.health_router import router as health_router
from src.api.auth_router import router as auth_router
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
from src.config.settings import settings


app = FastAPI(
    title="Todo Backend with Authentication",
    version="1.0.0",
    redoc_url="/redoc",
    docs_url="/docs"
)

# Configure allowed origins
allowed_origins = ["*"]  # In production, replace with specific origins
if settings.ALLOWED_ORIGINS:
    allowed_origins = settings.ALLOWED_ORIGINS.split(",")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(rate_limit_middleware)

# Add exception handlers
app.add_exception_handler(FastAPIHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Set up monitoring and observability
setup_monitoring(app)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(todo_log_router, prefix="/api", tags=["Logs"])  # Include before todo_router to avoid route conflicts
app.include_router(todo_router, prefix="/api", tags=["Todos"])
app.include_router(health_router, tags=["Health"])

@app.get("/")
def read_root():
    return {"message": "Welcome! to the Todo Backend API with Authentication"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)