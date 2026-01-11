// src/services/todoApi.ts
import { TodoItem } from '@/lib/types';
import { baseRequest } from './api';
import { backendToFrontendTodo, frontendToBackendTodo, frontendToBackendUpdate } from './backendAdapters';

// Define the shape of backend todo API responses
interface BackendTodoResponse {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Get all todos for the current user
export async function getTodos(
  page: number = 1,
  limit: number = 10,
  status?: 'all' | 'active' | 'completed',
  priority?: 'all' | 'low' | 'medium' | 'high',
  search?: string
): Promise<{ items: TodoItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  // Calculate offset based on page and limit
  const offset = (page - 1) * limit;

  // Construct query parameters for backend
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  // Map status to completed filter for backend
  if (status === 'completed') params.append('completed', 'true');
  if (status === 'active') params.append('completed', 'false');

  const queryString = params.toString();
  const endpoint = `/api/v1/todos${queryString ? `?${queryString}` : ''}`;

  try {
    // Make request to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch todos: ${response.status} - ${errorText}`);
    }

    const backendTodos: BackendTodoResponse[] = await response.json();

    // Convert backend todos to frontend format
    const frontendTodos = backendTodos.map(backendToFrontendTodo);

    // Calculate pagination info
    const total = frontendTodos.length; // This would need to come from the backend in a real implementation
    const totalPages = Math.ceil(total / limit);

    return {
      items: frontendTodos,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

// Create a new todo
export async function createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoItem> {
  const backendTodo = frontendToBackendTodo(todo);
  const endpoint = '/api/v1/todos';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendTodo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create todo: ${response.status} - ${errorText}`);
    }

    const createdBackendTodo: BackendTodoResponse = await response.json();

    // Convert backend response to frontend format
    return backendToFrontendTodo(createdBackendTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

// Get a specific todo by ID
export async function getTodoById(id: string): Promise<TodoItem> {
  const endpoint = `/api/v1/todos/${id}`;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch todo: ${response.status} - ${errorText}`);
    }

    const backendTodo: BackendTodoResponse = await response.json();

    // Convert backend response to frontend format
    return backendToFrontendTodo(backendTodo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    throw error;
  }
}

// Update a todo
export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
  const backendUpdates = frontendToBackendUpdate(updates);
  const endpoint = `/api/v1/todos/${id}`;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendUpdates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update todo: ${response.status} - ${errorText}`);
    }

    const updatedBackendTodo: BackendTodoResponse = await response.json();

    // Convert backend response to frontend format
    return backendToFrontendTodo(updatedBackendTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

// Toggle todo completion status
export async function toggleTodoCompletion(id: string): Promise<{ id: string; completed: boolean; updatedAt: string }> {
  // Get the current todo to check its completion status
  const currentTodo = await getTodoById(id);

  // Update the completion status
  const updatedTodo = await updateTodo(id, {
    ...currentTodo,
    completed: !currentTodo.completed
  });

  return {
    id: updatedTodo.id,
    completed: updatedTodo.completed,
    updatedAt: updatedTodo.updatedAt.toISOString()
  };
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  const endpoint = `/api/v1/todos/${id}`;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete todo: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

// Bulk delete todos
export async function bulkDeleteTodos(ids: string[]): Promise<{ deleted_count: number; requested_count: number }> {
  const endpoint = '/api/v1/todos/bulk-delete';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo_ids: ids.map(id => parseInt(id)) }), // Convert string IDs to integers for backend
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to bulk delete todos: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
      deleted_count: result.deleted_count,
      requested_count: result.requested_count
    };
  } catch (error) {
    console.error('Error bulk deleting todos:', error);
    throw error;
  }
}