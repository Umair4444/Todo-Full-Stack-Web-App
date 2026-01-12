import sys
import os
sys.path.insert(0, os.getcwd())

print("Python path:", sys.path[:3])  # Show first 3 entries

try:
    print("Attempting to import FastAPI...")
    from fastapi import FastAPI
    print("FastAPI imported successfully")
    
    print("Attempting to import todo_router...")
    from src.api.todo_router import router as todo_router
    print("todo_router imported successfully")
    
    print("Attempting to import health_router...")
    from src.api.health_router import router as health_router
    print("health_router imported successfully")
    
    print("Attempting to import rate_limit middleware...")
    from src.middleware.rate_limit import rate_limit_middleware
    print("rate_limit middleware imported successfully")
    
    print("Attempting to import exception handlers...")
    from src.exception_handlers import (
        http_exception_handler,
        validation_exception_handler,
        general_exception_handler
    )
    print("exception handlers imported successfully")
    
    print("Attempting to import FastAPI exceptions...")
    from fastapi.exceptions import RequestValidationError
    from fastapi import HTTPException as FastAPIHTTPException
    print("FastAPI exceptions imported successfully")
    
    print("Attempting to import CORS middleware...")
    from fastapi.middleware.cors import CORSMiddleware
    print("CORS middleware imported successfully")
    
    print("Attempting to import monitoring...")
    from src.monitoring import setup_monitoring
    print("monitoring imported successfully")
    
    print("Creating FastAPI app...")
    app = FastAPI(
        title="Todo Backend",
        version="1.0.0",
        redoc_url="/redoc",
        docs_url="/docs"
    )
    print("FastAPI app created successfully")
    
    print("Adding CORS middleware...")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("CORS middleware added successfully")
    
    print("Adding rate limit middleware...")
    app.middleware("http")(rate_limit_middleware)
    print("Rate limit middleware added successfully")
    
    print("Adding exception handlers...")
    app.add_exception_handler(FastAPIHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
    print("Exception handlers added successfully")
    
    print("Setting up monitoring...")
    setup_monitoring(app)
    print("Monitoring set up successfully")
    
    print("Including routers...")
    app.include_router(todo_router)
    app.include_router(health_router)
    print("Routers included successfully")
    
    print("Adding root endpoint...")
    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo Backend API"}
    print("Root endpoint added successfully")
    
    print("SUCCESS: All imports and setup completed successfully!")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()