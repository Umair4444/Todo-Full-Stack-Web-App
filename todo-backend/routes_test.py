from fastapi import FastAPI
from fastapi.routing import APIRoute

# Create a minimal app to test route registration
app = FastAPI(title="Todo Backend Test", version="1.0.0")

# Define the same routes as in the todo router but without database dependencies
@app.get("/api/v1/todos/")
def get_todos_test():
    return {"message": "get_todos endpoint working"}

@app.post("/api/v1/todos/")
def create_todo_test():
    return {"message": "create_todo endpoint working"}

@app.get("/api/v1/todos/{todo_id}")
def get_todo_test(todo_id: int):
    return {"message": f"get_todo endpoint working for id {todo_id}"}

@app.put("/api/v1/todos/{todo_id}")
def update_todo_test(todo_id: int):
    return {"message": f"update_todo endpoint working for id {todo_id}"}

@app.delete("/api/v1/todos/{todo_id}")
def delete_todo_test(todo_id: int):
    return {"message": f"delete_todo endpoint working for id {todo_id}"}

@app.patch("/api/v1/todos/{todo_id}/toggle-completion")
def toggle_completion_test(todo_id: int):
    return {"message": f"toggle_completion endpoint working for id {todo_id}"}

@app.post("/api/v1/todos/bulk-delete")
def bulk_delete_todos_test():
    return {"message": "bulk_delete endpoint working"}

# Print all registered routes
print("Registered routes:")
for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"  {route.methods} {route.path}")

print("\nThe 307 redirect issue occurs when there's a mismatch between:")
print("- Requested URL: /api/v1/todos (without trailing slash)")
print("- Defined route: /api/v1/todos/ (with trailing slash)")
print("\nFastAPI automatically redirects from one to the other.")
print("This is expected behavior for URL canonicalization.")
print("\nThe solution is to ensure clients make requests to the correct URL format.")