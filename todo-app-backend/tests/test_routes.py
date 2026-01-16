import asyncio
from fastapi import FastAPI
from src.api.todo_router import router as todo_router
from src.api.health_router import router as health_router

app = FastAPI(title="Todo Backend", version="1.0.0")

# Include routers
app.include_router(todo_router)
app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Backend API"}

async def test_server():
    # Test importing and creating the app
    print("App created successfully")
    
    # Test that routes are registered
    routes = [route.path for route in app.routes]
    print(f"Registered routes: {routes}")
    
    # Check if the problematic route is there
    if "/api/todos" in routes:
        print("Todo routes are registered correctly")
    else:
        print("Todo routes may not be registered correctly")

if __name__ == "__main__":
    asyncio.run(test_server())