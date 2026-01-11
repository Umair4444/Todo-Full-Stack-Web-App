import requests
import json

# Test the bulk delete functionality
base_url = "http://localhost:8000"

# First, let's create some test todos
print("Creating test todos...")
for i in range(5):
    todo_data = {
        "title": f"Test Todo {i}",
        "description": f"Description for test todo {i}",
        "is_completed": False
    }
    response = requests.post(f"{base_url}/api/v1/todos/", json=todo_data)
    print(f"Created todo {i}: {response.status_code}")

# Get all todos to see what we have
print("\nGetting all todos...")
response = requests.get(f"{base_url}/api/v1/todos/")
todos = response.json()
print(f"Found {len(todos)} todos")
for todo in todos:
    print(f"  - ID: {todo['id']}, Title: {todo['title']}")

# Now try bulk delete
todo_ids = [todo['id'] for todo in todos]
print(f"\nAttempting to bulk delete todos with IDs: {todo_ids}")
bulk_delete_data = {"todo_ids": todo_ids}
response = requests.post(f"{base_url}/api/v1/todos/bulk-delete", json=bulk_delete_data)
print(f"Bulk delete response: {response.status_code}")
print(f"Response content: {response.text}")

# Check if todos are deleted
print("\nChecking if todos were deleted...")
response = requests.get(f"{base_url}/api/v1/todos/")
remaining_todos = response.json()
print(f"Remaining todos: {len(remaining_todos)}")
for todo in remaining_todos:
    print(f"  - ID: {todo['id']}, Title: {todo['title']}")