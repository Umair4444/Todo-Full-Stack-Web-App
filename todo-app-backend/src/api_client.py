# Todo Backend API Client SDK

"""
API Client SDK for Todo Backend

This SDK provides convenient methods to interact with the Todo Backend API.
"""

import requests
from typing import Optional, List, Dict, Any


class TodoAPIClient:
    def __init__(self, base_url: str, timeout: int = 30):
        """
        Initialize the Todo API client.

        Args:
            base_url: The base URL of the Todo Backend API
            timeout: Request timeout in seconds (default: 30)
        """
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[Any, Any]:
        """
        Make an HTTP request to the API.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (e.g., "/api/v1/todos")
            **kwargs: Additional arguments to pass to requests

        Returns:
            JSON response from the API
        """
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, timeout=self.timeout, **kwargs)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()

    def get_todos(self, offset: int = 0, limit: int = 100, completed: Optional[bool] = None) -> List[Dict[str, Any]]:
        """
        Get a list of todos with optional filtering and pagination.

        Args:
            offset: Number of items to skip (for pagination)
            limit: Maximum number of items to return
            completed: Filter by completion status (True/False)

        Returns:
            List of todo items
        """
        params = {"offset": offset, "limit": limit}
        if completed is not None:
            params["completed"] = completed

        return self._make_request("GET", "/api/v1/todos", params=params)

    def create_todo(self, title: str, description: Optional[str] = None, is_completed: bool = False, priority: str = "low") -> Dict[str, Any]:
        """
        Create a new todo item.

        Args:
            title: Title of the todo item (required)
            description: Description of the todo item (optional)
            is_completed: Completion status (default: False)
            priority: Priority level ("low", "medium", or "high", default: "low")

        Returns:
            Created todo item
        """
        data = {
            "title": title,
            "description": description,
            "is_completed": is_completed,
            "priority": priority
        }
        return self._make_request("POST", "/api/v1/todos", json=data)

    def get_todo(self, todo_id: int) -> Dict[str, Any]:
        """
        Get a specific todo item by ID.

        Args:
            todo_id: ID of the todo item

        Returns:
            Todo item data
        """
        return self._make_request("GET", f"/api/v1/todos/{todo_id}")

    def update_todo(self, todo_id: int, title: Optional[str] = None,
                    description: Optional[str] = None, is_completed: Optional[bool] = None, priority: Optional[str] = None) -> Dict[str, Any]:
        """
        Update a specific todo item by ID.

        Args:
            todo_id: ID of the todo item to update
            title: New title (optional)
            description: New description (optional)
            is_completed: New completion status (optional)
            priority: New priority level ("low", "medium", or "high", optional)

        Returns:
            Updated todo item
        """
        data = {}
        if title is not None:
            data["title"] = title
        if description is not None:
            data["description"] = description
        if is_completed is not None:
            data["is_completed"] = is_completed
        if priority is not None:
            data["priority"] = priority

        return self._make_request("PUT", f"/api/v1/todos/{todo_id}", json=data)

    def delete_todo(self, todo_id: int) -> Dict[str, Any]:
        """
        Delete a specific todo item by ID.

        Args:
            todo_id: ID of the todo item to delete

        Returns:
            Deletion confirmation
        """
        return self._make_request("DELETE", f"/api/v1/todos/{todo_id}")

    def health_check(self) -> Dict[str, Any]:
        """
        Check the health status of the API.

        Returns:
            Health check result
        """
        return self._make_request("GET", "/health")


# Example usage:
if __name__ == "__main__":
    # Initialize the client
    client = TodoAPIClient(base_url="http://localhost:8000")

    # Create a new todo with priority
    new_todo = client.create_todo(
        title="Sample Todo",
        description="This is a sample todo item",
        is_completed=False,
        priority="high"  # High priority
    )
    print(f"Created todo: {new_todo}")

    # Get all todos
    todos = client.get_todos()
    print(f"All todos: {todos}")

    # Update the todo with new priority
    updated_todo = client.update_todo(
        todo_id=new_todo["id"],
        title="Updated Sample Todo",
        is_completed=True,
        priority="medium"  # Medium priority
    )
    print(f"Updated todo: {updated_todo}")

    # Get the specific todo
    specific_todo = client.get_todo(new_todo["id"])
    print(f"Specific todo: {specific_todo}")

    # Delete the todo
    delete_result = client.delete_todo(new_todo["id"])
    print(f"Delete result: {delete_result}")