import sys
import os
sys.path.insert(0, os.getcwd())

print("Setting up the application...")

try:
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
        allow_origins=["*"],
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

    print("Application setup complete!")

    # Test that the routes work as expected
    print("\nTesting route definitions...")
    
    # Import the functions to make sure they work
    from src.services.todo_service import TodoService
    from src.models.todo_model import TodoItemCreate
    from sqlmodel import Session
    
    print("All components imported successfully!")
    
    # Try to run a simple test
    print("\nTrying to start server...")
    import uvicorn
    print("Uvicorn imported successfully")
    
    # Instead of running the server, just validate the app
    print(f"App routes: {[route.path for route in app.routes]}")
    
    print("\nApplication is ready to run!")
    
except Exception as e:
    print(f"Error setting up application: {e}")
    import traceback
    traceback.print_exc()