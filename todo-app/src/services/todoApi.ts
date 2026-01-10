// src/services/todoApi.ts
import { TodoItem } from '@/lib/types';
import { baseRequest } from './api';

// Define the shape of todo API responses
interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string format
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string format
}

interface TodoListResponse {
  items: TodoItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all todos for the current user
export async function getTodos(
  page: number = 1,
  limit: number = 10,
  status?: 'all' | 'active' | 'completed',
  priority?: 'all' | 'low' | 'medium' | 'high',
  search?: string
): Promise<TodoListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (search) params.append('search', search);

  const queryString = params.toString();
  const endpoint = `/todos${queryString ? `?${queryString}` : ''}`;

  const response = await baseRequest<TodoListResponse>(endpoint, { method: 'GET' });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch todos');
  }
  
  return response.data!;
}

// Create a new todo
export async function createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoItem> {
  const requestBody: CreateTodoRequest = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate?.toISOString(),
  };

  const response = await baseRequest<TodoItem>('/todos', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to create todo');
  }
  
  return response.data!;
}

// Get a specific todo by ID
export async function getTodoById(id: string): Promise<TodoItem> {
  const response = await baseRequest<TodoItem>(`/todos/${id}`, { method: 'GET' });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch todo');
  }
  
  return response.data!;
}

// Update a todo
export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
  const requestBody: UpdateTodoRequest = {
    title: updates.title,
    description: updates.description,
    completed: updates.completed,
    priority: updates.priority,
    dueDate: updates.dueDate?.toISOString(),
  };

  const response = await baseRequest<TodoItem>(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestBody),
  });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to update todo');
  }
  
  return response.data!;
}

// Toggle todo completion status
export async function toggleTodoCompletion(id: string): Promise<{ id: string; completed: boolean; updatedAt: string }> {
  const response = await baseRequest<{ id: string; completed: boolean; updatedAt: string }>(`/todos/${id}/toggle`, {
    method: 'PATCH',
  });

  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to toggle todo completion');
  }

  return response.data!;
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  const response = await baseRequest<{}>(`/todos/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to delete todo');
  }
}

// Bulk delete todos
export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  const response = await baseRequest<{}>('/todos/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to bulk delete todos');
  }
}