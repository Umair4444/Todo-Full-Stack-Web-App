# Frontend Integration Guide

This guide explains how to connect your frontend deployed on Vercel to your backend deployed on Hugging Face Spaces.

## Overview

Your frontend is deployed on Vercel at: `https://todo-full-stack-web-app-three.vercel.app/todo-app`

Your backend should be deployed on Hugging Face Spaces and accessible via API endpoints.

## CORS Configuration

To allow your Vercel frontend to communicate with your backend, you need to configure CORS properly.

### Backend Configuration

1. **Update Environment Variables in Hugging Face Spaces:**
   - Go to your Hugging Face Space settings
   - Under "Environment Variables" or "Secrets", ensure you have:
   
   ```
   ALLOWED_ORIGINS=https://todo-full-stack-web-app-three.vercel.app,http://localhost:3000
   ```

2. **If you're using the default configuration**, the backend allows all origins (`"*"`), which will work but is less secure.

### Frontend Configuration

1. **Update API Base URL in Frontend:**
   In your frontend application, make sure your API calls point to your backend URL:
   
   ```javascript
   // Example API base URL for backend deployed on Hugging Face Spaces
   const BACKEND_BASE_URL = 'https://[your-username]-[your-space-name].hf.space';
   
   // Example API calls
   const response = await fetch(`${BACKEND_BASE_URL}/api/v1/todos`);
   ```

## API Endpoints

Your backend provides the following endpoints:

- `GET /api/v1/todos` - Get all todo items
- `POST /api/v1/todos` - Create a new todo item (with optional priority)
- `GET /api/v1/todos/{id}` - Get a specific todo item (includes priority)
- `PUT /api/v1/todos/{id}` - Update a specific todo item (including priority)
- `DELETE /api/v1/todos/{id}` - Delete a specific todo item
- `POST /api/v1/todos/bulk-delete` - Delete multiple todo items by ID
- `PATCH /api/v1/todos/{id}/toggle-completion` - Toggle completion status of a todo item
- `GET /health` - Check the health status of the application

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check that your `ALLOWED_ORIGINS` environment variable includes your Vercel domain
   - Verify the domain format is correct (includes `https://`)

2. **Network Errors:**
   - Ensure your backend is properly deployed and running
   - Check that the backend URL is correct in your frontend

3. **API Call Failures:**
   - Verify that API endpoints are being called with the correct path
   - Check browser developer tools for specific error messages

### Testing the Connection

1. **Test Backend Health:**
   Visit `https://[your-username]-[your-space-name].hf.space/health` to verify your backend is running

2. **Test API Endpoint:**
   Visit `https://[your-username]-[your-space-name].hf.space/docs` to access the interactive API documentation

3. **Check Browser Console:**
   Look for any CORS or network errors in your frontend's browser console

## Security Considerations

1. **Production Environment:**
   - Use specific allowed origins instead of wildcard (`"*"`)
   - Ensure sensitive data is not exposed in frontend code
   - Use HTTPS for all communications

2. **Environment Variables:**
   - Never commit sensitive information to version control
   - Use environment variables for API URLs and other configuration

## Example Frontend Code

Here's an example of how to make API calls from your frontend to your backend:

```javascript
// Function to fetch todos from backend
async function fetchTodos() {
  try {
    const response = await fetch('https://[your-username]-[your-space-name].hf.space/api/v1/todos');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todos = await response.json();
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

// Function to create a new todo with priority
async function createTodo(todoData) {
  try {
    // Default priority is "low", but you can set it to "low", "medium", or "high"
    const todoWithPriority = {
      ...todoData,
      priority: todoData.priority || "low"  // Set priority level ("low", "medium", or "high")
    };

    const response = await fetch('https://[your-username]-[your-space-name].hf.space/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoWithPriority),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newTodo = await response.json();
    return newTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

// Function to update a todo including priority
async function updateTodo(todoId, updateData) {
  try {
    const response = await fetch(`https://[your-username]-[your-space-name].hf.space/api/v1/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedTodo = await response.json();
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}
```

## Priority Management

The API now supports priority management for todo items. Priority levels are represented as strings:

- "low": Low priority
- "medium": Medium priority
- "high": High priority

When creating or updating a todo item, you can specify the priority level:

```javascript
// Creating a high priority todo
const highPriorityTodo = await createTodo({
  title: "Urgent task",
  description: "This needs to be done immediately",
  priority: "high"  // High priority
});

// Updating a todo's priority
const updatedTodo = await updateTodo(todoId, {
  title: "Updated task",
  priority: "medium"  // Medium priority
});
```

## Deployment Checklist

- [ ] Backend deployed on Hugging Face Spaces
- [ ] CORS configured with Vercel domain in `ALLOWED_ORIGINS`
- [ ] Frontend updated with correct backend API URL
- [ ] Health check endpoint accessible
- [ ] API endpoints working correctly
- [ ] Browser console shows no CORS or network errors