print("Testing import...")

try:
    from src.api.todo_router import router as todo_router
    print("Successfully imported todo_router")
    
    # Print the routes in the router
    print("Routes in todo_router:")
    for route in todo_router.routes:
        print(f"  {route.methods} {route.path}")
        
except Exception as e:
    print(f"Error importing todo_router: {e}")
    import traceback
    traceback.print_exc()

try:
    from src.api.health_router import router as health_router
    print("\nSuccessfully imported health_router")
except Exception as e:
    print(f"Error importing health_router: {e}")
    import traceback
    traceback.print_exc()

print("\nTesting app creation...")

try:
    from fastapi import FastAPI
    app = FastAPI(title="Todo Backend", version="1.0.0")
    
    # Include routers
    app.include_router(todo_router)
    app.include_router(health_router)
    
    print("App created successfully with routers included")
    
    # Print all registered routes
    print("\nAll registered routes:")
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            print(f"  {route.methods} {route.path}")
    
    print("\nTest completed successfully!")
    
except Exception as e:
    print(f"Error creating app: {e}")
    import traceback
    traceback.print_exc()