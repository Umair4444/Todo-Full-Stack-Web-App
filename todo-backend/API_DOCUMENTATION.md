# Todo Backend API Documentation

## Overview

The Todo Backend API provides RESTful endpoints for managing todo items. It's built with FastAPI and uses Neon Serverless PostgreSQL as the database with SQLModel as the ORM.

## Base URL

All API endpoints are prefixed with `/api/v1/` unless otherwise noted.

## Authentication

This API does not require authentication for basic operations. For protected endpoints (to be implemented in future versions), Bearer token authentication will be used.

## Common Headers

- `Content-Type: application/json` - Required for POST/PUT requests
- `Accept: application/json` - Expected response format

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource does not exist
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

Error responses follow this format:
```json
{
  "detail": "Error message"
}
```

## Rate Limiting

The API implements rate limiting at 100 requests per hour per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.

## Endpoints

### Todos

#### Get all todos
- **Endpoint**: `GET /api/v1/todos`
- **Description**: Retrieve a list of todo items with optional filtering and pagination
- **Query Parameters**:
  - `offset` (integer, optional): Number of items to skip (default: 0)
  - `limit` (integer, optional): Maximum number of items to return (default: 100, max: 100)
  - `completed` (boolean, optional): Filter by completion status
- **Response**: Array of todo items
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:8000/api/v1/todos?offset=0&limit=10&completed=false"
  ```
- **Example Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the todo app backend",
      "is_completed": false,
      "created_at": "2023-01-01T10:00:00",
      "updated_at": "2023-01-01T10:00:00"
    }
  ]
  ```

#### Create a todo
- **Endpoint**: `POST /api/v1/todos`
- **Description**: Create a new todo item
- **Request Body**:
  ```json
  {
    "title": "string (required, 1-255 chars)",
    "description": "string (optional, max 1000 chars)",
    "is_completed": "boolean (optional, default: false)"
  }
  ```
- **Response**: Created todo item
- **Example Request**:
  ```bash
  curl -X POST "http://localhost:8000/api/v1/todos" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "New todo",
      "description": "Description of the new todo",
      "is_completed": false
    }'
  ```
- **Example Response**:
  ```json
  {
    "id": 1,
    "title": "New todo",
    "description": "Description of the new todo",
    "is_completed": false,
    "created_at": "2023-01-01T10:00:00",
    "updated_at": "2023-01-01T10:00:00"
  }
  ```

#### Get a specific todo
- **Endpoint**: `GET /api/v1/todos/{id}`
- **Description**: Retrieve a specific todo item by ID
- **Path Parameter**:
  - `id` (integer): ID of the todo item
- **Response**: Todo item or 404 if not found
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:8000/api/v1/todos/1"
  ```
- **Example Response**:
  ```json
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the todo app backend",
    "is_completed": false,
    "created_at": "2023-01-01T10:00:00",
    "updated_at": "2023-01-01T10:00:00"
  }
  ```

#### Update a todo
- **Endpoint**: `PUT /api/v1/todos/{id}`
- **Description**: Update an existing todo item
- **Path Parameter**:
  - `id` (integer): ID of the todo item to update
- **Request Body** (all fields optional):
  ```json
  {
    "title": "string (optional, 1-255 chars)",
    "description": "string (optional, max 1000 chars)",
    "is_completed": "boolean (optional)"
  }
  ```
- **Response**: Updated todo item or 404 if not found
- **Example Request**:
  ```bash
  curl -X PUT "http://localhost:8000/api/v1/todos/1" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Updated todo",
      "is_completed": true
    }'
  ```
- **Example Response**:
  ```json
  {
    "id": 1,
    "title": "Updated todo",
    "description": "Description of the new todo",
    "is_completed": true,
    "created_at": "2023-01-01T10:00:00",
    "updated_at": "2023-01-01T11:00:00"
  }
  ```

#### Delete a todo
- **Endpoint**: `DELETE /api/v1/todos/{id}`
- **Description**: Delete a specific todo item
- **Path Parameter**:
  - `id` (integer): ID of the todo item to delete
- **Response**: Success message or 404 if not found
- **Example Request**:
  ```bash
  curl -X DELETE "http://localhost:8000/api/v1/todos/1"
  ```
- **Example Response**:
  ```json
  {
    "message": "Todo item deleted successfully"
  }
  ```

### Health Check

#### Check API health
- **Endpoint**: `GET /health`
- **Description**: Check the health status of the API and database connection
- **Response**: Health status information
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:8000/health"
  ```
- **Example Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": 1672531200.123456,
    "response_time_ms": 15.23,
    "details": {
      "database": "connected",
      "api": "responsive"
    }
  }
  ```

## Data Models

### TodoItem
- `id` (integer): Unique identifier (auto-generated)
- `title` (string): Title of the todo item (1-255 characters)
- `description` (string, nullable): Detailed description (max 1000 characters)
- `is_completed` (boolean): Completion status (default: false)
- `created_at` (datetime): Timestamp when the item was created
- `updated_at` (datetime): Timestamp when the item was last updated

## API Client SDK

The repository includes a Python API client SDK (`src/api_client.py`) that provides convenient methods to interact with the Todo Backend API.

### Installation

```bash
pip install requests
```

### Usage

```python
from src.api_client import TodoAPIClient

# Initialize the client
client = TodoAPIClient(base_url="http://localhost:8000")

# Create a new todo
new_todo = client.create_todo(
    title="Sample Todo",
    description="This is a sample todo item",
    is_completed=False
)

# Get all todos
todos = client.get_todos()

# Update a todo
updated_todo = client.update_todo(
    todo_id=new_todo["id"],
    title="Updated Sample Todo",
    is_completed=True
)

# Delete a todo
delete_result = client.delete_todo(new_todo["id"])
```

## API Versioning

The API uses URI path versioning (e.g., `/api/v1/`). Future versions will be released as `/api/v2/`, `/api/v3/`, etc. Breaking changes will be accompanied by a new version number.

## CORS Policy

The API allows cross-origin requests from all origins. In production, this should be restricted to specific domains.

## Performance

The API is designed to respond to requests in under 200ms for 95% of requests under normal load conditions.