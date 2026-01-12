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

if __name__ == "__main__":
    import uvicorn
    print("Starting server...")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")