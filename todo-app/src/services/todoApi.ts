// src/services/todoApi.ts
import { TodoItem } from '@/lib/types';
import axios from 'axios';
import apiClient from './api';
import { backendToFrontendTodo, frontendToBackendTodo, frontendToBackendUpdate } from './backendAdapters';

// Define the shape of backend todo API responses
interface BackendTodoResponse {
  id: string; // Changed to string to match UUID
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
  priority: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// Get all todos for the current user
export async function getTodos(
  page: number = 1,
  limit: number = 10,
  status?: 'all' | 'active' | 'completed',
  priority?: 'all' | 'low' | 'medium' | 'high',
  search?: string
): Promise<{ items: TodoItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  // Calculate skip based on page and limit (backend uses 'skip' instead of 'offset')
  const skip = (page - 1) * limit;

  // Construct query parameters for backend
  const params: Record<string, string> = {
    skip: skip.toString(),
    limit: limit.toString(),
  };

  // Map status to completed filter for backend
  if (status === 'completed') params.completed = 'true';
  if (status === 'active') params.completed = 'false';

  try {
    // Make request to backend using apiClient
    const response = await apiClient.get('/todos', { params });

    const backendTodos: BackendTodoResponse[] = response.data;

    // Convert backend todos to frontend format
    const frontendTodos = backendTodos.map(backendToFrontendTodo);

    // The backend should return pagination info, but for now we'll calculate based on response
    // In a real implementation, the backend would return total count separately
    // For now, we'll assume the total is unknown and just return the count of items received
    const total = response.headers['x-total-count'] || frontendTodos.length; // Backend should send total count in header

    // For now, we'll just use the length of items returned
    const actualTotal = frontendTodos.length;
    const totalPages = Math.ceil(actualTotal / limit);

    return {
      items: frontendTodos,
      pagination: {
        page,
        limit,
        total: actualTotal,
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

  try {
    const response = await apiClient.post('/todos', backendTodo);

    const createdBackendTodo: BackendTodoResponse = response.data;

    // Convert backend response to frontend format
    return backendToFrontendTodo(createdBackendTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

// Get a specific todo by ID
export async function getTodoById(id: string): Promise<TodoItem> {
  try {
    const response = await apiClient.get(`/todos/${id}`);

    const backendTodo: BackendTodoResponse = response.data;

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

  try {
    const response = await apiClient.put(`/todos/${id}`, backendUpdates);

    const updatedBackendTodo: BackendTodoResponse = response.data;

    // Convert backend response to frontend format
    return backendToFrontendTodo(updatedBackendTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

// Toggle todo completion status
export async function toggleTodoCompletion(id: string): Promise<{ id: string; completed: boolean; updatedAt: string }> {
  try {
    const response = await apiClient.patch(`/todos/${id}/toggle-completion`);

    const result = response.data;

    // Convert backend response to frontend format
    return {
      id: result.id,
      completed: result.is_completed,
      updatedAt: result.updated_at
    };
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    throw error;
  }
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  try {
    await apiClient.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

// Bulk delete todos
export async function bulkDeleteTodos(ids: string[]): Promise<{ deleted_count: number; requested_count: number }> {
  try {
    const response = await apiClient.post('/todos/bulk-delete', { todo_ids: ids });

    const result = response.data;
    return {
      deleted_count: result.deleted_count,
      requested_count: result.requested_count
    };
  } catch (error) {
    console.error('Error bulk deleting todos:', error);
    throw error;
  }
}

// Define the shape of backend todo log API responses
interface BackendTodoLogResponse {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  todo_id?: string;
  user_id: string;
  timestamp: string;
  previous_state?: any;
  new_state?: any;
}

// Get todo logs for the current user
export async function getTodoLogs(
  page: number = 1,
  limit: number = 10,
  action?: 'CREATE' | 'UPDATE' | 'DELETE'
): Promise<{ items: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  // Validate inputs to prevent 422 errors
  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 10; // Set reasonable limits

  // Calculate skip based on page and limit (backend uses 'skip' instead of 'offset')
  const skip = (page - 1) * limit;

  // Construct query parameters for backend
  const params: Record<string, string> = {
    skip: skip.toString(),
    limit: limit.toString(),
  };

  // Add action filter if provided and valid
  if (action && ['CREATE', 'UPDATE', 'DELETE'].includes(action)) {
    params.action = action;
  }

  try {
    // Make request to backend using apiClient
    const response = await apiClient.get('/todos/logs', { params });

    // Backend now returns just an array of logs
    const backendLogs: BackendTodoLogResponse[] = response.data;

    // Transform the logs to the expected format
    const frontendLogs = backendLogs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp).toISOString()
    }));

    // Calculate pagination info
    // Get total count from response headers if available, otherwise use array length
    const total = parseInt(response.headers['x-total-count']) || frontendLogs.length;
    const totalPages = Math.ceil(total / limit);

    return {
      items: frontendLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching todo logs:', error);

    // Check if it's an Axios error with response
    if (axios.isAxiosError(error)) {
      // More defensive error handling
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      const data = error.response?.data;
      const message = error.message;
      const url = error.config?.url;
      const requestParams = error.config?.params;

      const errorDetails = {
        status: status,
        statusText: statusText,
        data: data,
        message: message,
        url: url,
        params: requestParams,
        raw_error: error
      };

      console.error('Axios error details:', errorDetails);

      // For 422 errors, return an empty result instead of throwing to prevent UI crashes
      if (status === 422) {
        console.warn('Todo logs endpoint not available or validation failed. Returning empty logs.');
        return {
          items: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
          }
        };
      }

      // For 401/403 errors (authentication), return empty logs
      if (status === 401 || status === 403) {
        console.warn('Authentication required for todo logs. Returning empty logs.');
        return {
          items: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
          }
        };
      }

      // For other types of errors, return empty logs as fallback
      console.warn(`Error ${status} while fetching todo logs. Returning empty logs.`);
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1
        }
      };
    }

    // If it's not an Axios error, return empty logs as fallback
    console.warn('Network error while fetching todo logs. Returning empty logs.', error);
    return {
      items: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      }
    };
  }
}