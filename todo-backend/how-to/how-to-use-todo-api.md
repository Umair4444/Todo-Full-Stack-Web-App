# How-To: Use the Todo API

## Overview
This guide explains how to use the Todo API endpoints to manage todo items. The API provides full CRUD (Create, Read, Update, Delete) functionality for todo items, plus additional features like bulk operations and completion toggling.

## Base URL
The base URL for all API requests is:
```
https://your-domain.com/api/v1
```

For local development, the base URL is:
```
http://localhost:8000/api/v1
```

## Authentication
The current version of the API does not require authentication. All endpoints are publicly accessible.

## API Endpoints

### 1. Get All Todos
Retrieve a list of all todo items with optional filtering and pagination.

**Endpoint:** `GET /todos`

**Parameters:**
- `offset` (integer, optional): Number of records to skip (default: 0)
- `limit` (integer, optional): Maximum number of records to return (default: 100, max: 100)
- `completed` (boolean, optional): Filter by completion status (true/false)

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/todos?offset=0&limit=10&completed=false"
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "is_completed": false,
    "created_at": "2023-01-01T10:00:00",
    "updated_at": "2023-01-01T10:00:00"
  },
  {
    "id": 2,
    "title": "Walk the dog",
    "description": "Take Max to the park",
    "is_completed": true,
    "created_at": "2023-01-01T09:00:00",
    "updated_at": "2023-01-01T11:00:00"
  }
]
```

### 2. Create a New Todo
Create a new todo item.

**Endpoint:** `POST /todos`

**Request Body:**
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 1000 chars)",
  "is_completed": "boolean (optional, default: false)",
  "priority": "string (optional, 'low', 'medium', or 'high', default: 'low')"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/todos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn FastAPI",
    "description": "Complete the tutorial and build an app",
    "is_completed": false,
    "priority": "high"
  }'
```

**Response:**
```json
{
  "id": 3,
  "title": "Learn FastAPI",
  "description": "Complete the tutorial and build an app",
  "is_completed": false,
  "priority": "high",
  "created_at": "2023-01-01T12:00:00",
  "updated_at": "2023-01-01T12:00:00"
}
```

### 3. Get a Specific Todo
Retrieve a specific todo item by its ID.

**Endpoint:** `GET /todos/{id}`

**Path Parameter:**
- `id` (integer): The ID of the todo item to retrieve

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/v1/todos/1"
```

**Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "is_completed": false,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-01T10:00:00"
}
```

### 4. Update a Todo
Update an existing todo item. Partial updates are supported.

**Endpoint:** `PUT /todos/{id}`

**Path Parameter:**
- `id` (integer): The ID of the todo item to update

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "is_completed": "boolean (optional)",
  "priority": "string (optional, 'low', 'medium', or 'high')"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:8000/api/v1/todos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "is_completed": true,
    "description": "Milk, bread, eggs, fruits",
    "priority": "high"
  }'
```

**Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs, fruits",
  "is_completed": true,
  "priority": "high",
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-01T13:00:00"
}
```

### 5. Delete a Todo
Delete a specific todo item by its ID.

**Endpoint:** `DELETE /todos/{id}`

**Path Parameter:**
- `id` (integer): The ID of the todo item to delete

**Example Request:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/todos/1"
```

**Response:**
```json
{
  "message": "Todo item deleted successfully"
}
```

### 6. Bulk Delete Todos
Delete multiple todo items by their IDs.

**Endpoint:** `POST /todos/bulk-delete`

**Request Body:**
```json
{
  "todo_ids": "array of integers (required)"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/todos/bulk-delete" \
  -H "Content-Type: application/json" \
  -d '{
    "todo_ids": [1, 2, 3]
  }'
```

**Response:**
```json
{
  "message": "Successfully deleted 3 out of 3 todos",
  "deleted_count": 3,
  "requested_count": 3
}
```

### 7. Toggle Completion Status
Toggle the completion status of a specific todo item.

**Endpoint:** `PATCH /todos/{id}/toggle-completion`

**Path Parameter:**
- `id` (integer): The ID of the todo item to update

**Example Request:**
```bash
curl -X PATCH "http://localhost:8000/api/v1/todos/1/toggle-completion"
```

**Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "is_completed": true,
  "created_at": "2023-01-01T10:00:00",
  "updated_at": "2023-01-01T13:00:00"
}
```

## Utility Endpoints

### Health Check
Check the health status of the API and database connection.

**Endpoint:** `GET /health`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Response:**
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

### Metrics
Get application metrics in Prometheus format.

**Endpoint:** `GET /metrics`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/metrics"
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content to return
- `400 Bad Request`: Invalid request parameters or body
- `404 Not Found`: Requested resource does not exist
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Example Error Response:**
```json
{
  "detail": "Todo item not found"
}
```

## Best Practices

1. **Validate Input**: Always validate input data before sending requests
2. **Handle Errors**: Implement proper error handling in your client code
3. **Use HTTPS**: Always use HTTPS in production environments
4. **Rate Limiting**: Be mindful of the rate limits (100 requests/hour per IP)
5. **Pagination**: Use pagination for large datasets to improve performance
6. **Bulk Operations**: Use bulk delete for removing multiple items efficiently
7. **Completion Toggling**: Use the toggle endpoint to change completion status without knowing the current state