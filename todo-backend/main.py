from fastapi import FastAPI
from src.api.todo_router import router as todo_router
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

app = FastAPI(
    title="Todo Backend",
    version="1.0.0",
    redoc_url="/redoc",
    docs_url="/docs"
)



# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
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
app.include_router(todo_router)
app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)