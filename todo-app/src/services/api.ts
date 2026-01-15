// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // or however you store the JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login'; // or use router.push('/login')
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Export specific API functions
export const authAPI = {
  register: (userData: { email: string; password: string; first_name?: string; last_name?: string }) =>
    apiClient.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials).then(response => {
      // Store the token in localStorage for future requests
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      return response;
    }),

  logout: async () => {
    try {
      // Make the logout API call first
      const response = await apiClient.post('/auth/logout');
      // Clear the token after successful logout
      localStorage.removeItem('access_token');
      return response;
    } catch (error) {
      // Even if the backend logout fails, clear the local token
      // so the user is effectively logged out locally
      localStorage.removeItem('access_token');
      // Still log the error but don't necessarily throw it
      // depending on whether we want to notify the user of the failure
      console.error('Backend logout failed:', error);
      // Return a mock response to maintain the API contract
      return { data: { success: true }, status: 200 };
    }
  },
};

export const todoAPI = {
  getTodos: (params?: { status?: 'active' | 'completed' | 'all'; page?: number; limit?: number }) =>
    apiClient.get('/todos', { params }),

  createTodo: (todoData: { title: string; description?: string }) =>
    apiClient.post('/todos', todoData),

  updateTodo: (id: string, todoData: { title?: string; description?: string; is_completed?: boolean }) =>
    apiClient.put(`/todos/${id}`, todoData),

  deleteTodo: (id: string) =>
    apiClient.delete(`/todos/${id}`),
};

export const todoLogAPI = {
  getLogs: (params?: { page?: number; limit?: number; action?: 'CREATE' | 'UPDATE' | 'DELETE' }) =>
    apiClient.get('/todos/logs', { params }),
};