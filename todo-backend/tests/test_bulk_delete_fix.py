import requests
import time

# Test script to verify bulk delete functionality
BASE_URL = "http://localhost:8000"

def test_bulk_delete():
    print("Testing bulk delete functionality...")
    
    # Step 1: Create some test todos
    print("\n1. Creating test todos...")
    created_todos = []
    for i in range(5):
        todo_data = {
            "title": f"Test Todo {i}",
            "description": f"Description for test todo {i}",
            "is_completed": False
        }
        response = requests.post(f"{BASE_URL}/api/v1/todos/", json=todo_data)
        if response.status_code == 200:
            todo = response.json()
            created_todos.append(todo)
            print(f"   Created todo {i}: {todo['title']} (ID: {todo['id']})")
        else:
            print(f"   Failed to create todo {i}: {response.status_code}")
            return False

    # Step 2: Verify todos were created
    print(f"\n2. Verifying {len(created_todos)} todos were created...")
    response = requests.get(f"{BASE_URL}/api/v1/todos/")
    if response.status_code == 200:
        all_todos = response.json()
        print(f"   Found {len(all_todos)} todos in total")
        if len(all_todos) >= len(created_todos):
            print("   ✓ Todos were created successfully")
        else:
            print("   ✗ Some todos were not created")
            return False
    else:
        print(f"   ✗ Failed to fetch todos: {response.status_code}")
        return False

    # Step 3: Perform bulk delete
    print(f"\n3. Performing bulk delete on {len(created_todos)} todos...")
    todo_ids = [str(todo['id']) for todo in created_todos]  # Convert to string as expected by frontend
    bulk_delete_payload = {"todo_ids": [int(id) for id in todo_ids]}  # Convert back to int for backend
    print(f"   Sending bulk delete request for IDs: {bulk_delete_payload['todo_ids']}")
    
    response = requests.post(f"{BASE_URL}/api/v1/todos/bulk-delete", json=bulk_delete_payload)
    print(f"   Bulk delete response: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Result: {result}")
        print("   ✓ Bulk delete request was successful")
    else:
        print(f"   ✗ Bulk delete failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

    # Step 4: Verify todos were deleted
    print(f"\n4. Verifying todos were deleted...")
    response = requests.get(f"{BASE_URL}/api/v1/todos/")
    if response.status_code == 200:
        remaining_todos = response.json()
        print(f"   Found {len(remaining_todos)} todos after deletion")
        
        # Check that our test todos are no longer in the list
        created_todo_ids = {todo['id'] for todo in created_todos}
        remaining_todo_ids = {todo['id'] for todo in remaining_todos}
        intersection = created_todo_ids.intersection(remaining_todo_ids)
        
        if len(intersection) == 0:
            print("   ✓ All test todos were successfully deleted")
            return True
        else:
            print(f"   ✗ Some todos were not deleted: {intersection}")
            return False
    else:
        print(f"   ✗ Failed to fetch todos after deletion: {response.status_code}")
        return False

if __name__ == "__main__":
    success = test_bulk_delete()
    if success:
        print("\n✓ All tests passed! Bulk delete functionality is working correctly.")
    else:
        print("\n✗ Tests failed! There are issues with the bulk delete functionality.")