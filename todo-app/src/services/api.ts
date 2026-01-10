// API service stub for future backend connection
// This will be used when connecting to the Python FastAPI backend

import { TodoItem, UserPreferences } from '../lib/types';
import { toast } from 'sonner';

// Define the shape of API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Define the shape of API request bodies
interface TodoRequestBody {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string format
}

interface UpdateTodoRequestBody {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string format
}

interface PreferencesRequestBody {
  theme?: 'light' | 'dark';
  language?: 'en' | 'ur';
  notificationsEnabled?: boolean;
  autoSync?: boolean;
}

// Base API URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

// Create a base request function with error handling
async function baseRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authorization header if token exists
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
      signal: controller.signal, // Add abort signal for timeout
    });

    clearTimeout(timeoutId); // Clear timeout if request completes

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      const errorResponse: ApiResponse<T> = {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: data.message || response.statusText,
          details: data,
        },
      };

      // Show error toast notification
      toast.error(data.message || response.statusText);

      return errorResponse;
    }

    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);

    // Check if the error is due to timeout
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutResponse: ApiResponse<T> = {
        success: false,
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'Request timed out. Please check your connection and try again.',
          details: 'The request took too long to complete',
        },
      };

      // Show timeout error toast notification
      toast.error('Request timed out. Please check your connection and try again.');
      return timeoutResponse;
    }

    const errorResponse: ApiResponse<T> = {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error instanceof Error ? error.message : String(error),
      },
    };

    // Show error toast notification
    toast.error('Network error occurred. Please check your connection and try again.');

    return errorResponse;
  }
}

// Helper function to get authorization header
function getAuthHeader(): { Authorization?: string } {
  // In a real implementation, this would retrieve the JWT token from storage
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Health check endpoint
export async function checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
  return baseRequest('/health', { method: 'GET' });
}

// Todo API functions
export async function getTodos(
  page: number = 1,
  limit: number = 10,
  status?: 'all' | 'active' | 'completed',
  priority?: 'all' | 'low' | 'medium' | 'high',
  search?: string
): Promise<ApiResponse<{ items: TodoItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (search) params.append('search', search);

  const queryString = params.toString();
  const endpoint = `/todos${queryString ? `?${queryString}` : ''}`;

  return baseRequest(endpoint, { method: 'GET' });
}

export async function createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TodoItem>> {
  const requestBody: TodoRequestBody = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate?.toISOString(),
  };

  return baseRequest('/todos', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
}

export async function getTodoById(id: string): Promise<ApiResponse<TodoItem>> {
  return baseRequest(`/todos/${id}`, { method: 'GET' });
}

export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<ApiResponse<TodoItem>> {
  const requestBody: UpdateTodoRequestBody = {
    title: updates.title,
    description: updates.description,
    completed: updates.completed,
    priority: updates.priority,
    dueDate: updates.dueDate?.toISOString(),
  };

  return baseRequest(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestBody),
  });
}

export async function toggleTodoCompletion(id: string): Promise<ApiResponse<{ id: string; completed: boolean; updatedAt: string }>> {
  return baseRequest(`/todos/${id}/toggle`, {
    method: 'PATCH',
  });
}

export async function deleteTodo(id: string): Promise<ApiResponse<{}>> {
  return baseRequest(`/todos/${id}`, {
    method: 'DELETE',
  });
}

export async function bulkDeleteTodos(ids: string[]): Promise<ApiResponse<{}>> {
  return baseRequest('/todos/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

// User Preferences API functions
export async function getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
  return baseRequest('/preferences', { method: 'GET' });
}

export async function updateUserPreferences(prefs: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
  const requestBody: PreferencesRequestBody = {
    theme: prefs.theme,
    language: prefs.language,
    notificationsEnabled: prefs.notificationsEnabled,
    autoSync: prefs.autoSync,
  };

  return baseRequest('/preferences', {
    method: 'PUT',
    body: JSON.stringify(requestBody),
  });
}

// Export the base request function for custom API calls
export { baseRequest };