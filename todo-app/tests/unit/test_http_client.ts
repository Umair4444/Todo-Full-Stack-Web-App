/**
 * Unit tests for HTTP client implementation in frontend
 */

// Mock the environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

// Mock the localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock the window.location for redirect testing
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: jest.fn(),
  },
  writable: true,
});

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}));

import axios from 'axios';
import { apiClient, authAPI, todoAPI, todoLogAPI } from '@/services/api';

// Import the actual axios instance that was created
const mockedAxios = (axios.create as jest.MockedFunction<any>).mock.results[0].value;

describe('API Client Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create axios instance with correct base URL', () => {
    // The axios instance is already created, so we'll check if it was called with correct config
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('should have request interceptor that adds auth token', async () => {
    const token = 'test-jwt-token';
    localStorage.setItem('access_token', token);

    // Trigger the request interceptor by making a mock request
    const mockConfig = { headers: {} };
    mockedAxios.interceptors.request.use.mock.calls[0][0](mockConfig);

    expect(mockConfig.headers.Authorization).toBe(`Bearer ${token}`);
  });

  test('should not add auth header if no token exists', async () => {
    localStorage.removeItem('access_token');

    const mockConfig = { headers: {} };
    mockedAxios.interceptors.request.use.mock.calls[0][0](mockConfig);

    expect(mockConfig.headers.Authorization).toBeUndefined();
  });

  test('should have response interceptor that handles 401 errors', async () => {
    const mockError = {
      response: {
        status: 401,
      },
    };

    // Trigger the response interceptor
    const errorHandler = mockedAxios.interceptors.response.use.mock.calls[0][1];
    await expect(() => errorHandler(mockError)).rejects.toEqual(mockError);

    // Verify localStorage was cleared
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('Authentication API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('authAPI.register should make POST request to /auth/register', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      first_name: 'John',
      last_name: 'Doe'
    };

    mockedAxios.post.mockResolvedValue({ data: { id: '1', email: 'test@example.com' } });

    const result = await authAPI.register(userData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', userData);
    expect(result.data).toEqual({ id: '1', email: 'test@example.com' });
  });

  test('authAPI.login should make POST request to /auth/login', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };

    mockedAxios.post.mockResolvedValue({ data: { access_token: 'jwt-token' } });

    const result = await authAPI.login(credentials);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result.data).toEqual({ access_token: 'jwt-token' });
  });

  test('authAPI.logout should make POST request to /auth/logout', async () => {
    mockedAxios.post.mockResolvedValue({ data: { message: 'Logged out' } });

    const result = await authAPI.logout();

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/logout');
    expect(result.data).toEqual({ message: 'Logged out' });
  });
});

describe('Todo API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('todoAPI.getTodos should make GET request to /todos', async () => {
    const params = { status: 'active', page: 1, limit: 10 };

    mockedAxios.get.mockResolvedValue({ data: [] });

    const result = await todoAPI.getTodos(params);

    expect(mockedAxios.get).toHaveBeenCalledWith('/todos', { params });
    expect(result.data).toEqual([]);
  });

  test('todoAPI.createTodo should make POST request to /todos', async () => {
    const todoData = { title: 'Test Todo', description: 'Test Description' };

    mockedAxios.post.mockResolvedValue({ data: { id: '1', title: 'Test Todo' } });

    const result = await todoAPI.createTodo(todoData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/todos', todoData);
    expect(result.data).toEqual({ id: '1', title: 'Test Todo' });
  });

  test('todoAPI.updateTodo should make PUT request to /todos/:id', async () => {
    const id = '1';
    const todoData = { title: 'Updated Title', is_completed: true };

    mockedAxios.put.mockResolvedValue({ data: { id: '1', title: 'Updated Title' } });

    const result = await todoAPI.updateTodo(id, todoData);

    expect(mockedAxios.put).toHaveBeenCalledWith(`/todos/${id}`, todoData);
    expect(result.data).toEqual({ id: '1', title: 'Updated Title' });
  });

  test('todoAPI.deleteTodo should make DELETE request to /todos/:id', async () => {
    const id = '1';

    mockedAxios.delete.mockResolvedValue({ status: 204 });

    const result = await todoAPI.deleteTodo(id);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`/todos/${id}`);
    expect(result.status).toBe(204);
  });
});

describe('Todo Log API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('todoLogAPI.getLogs should make GET request to /todos/logs', async () => {
    const params = { page: 1, limit: 10, action: 'CREATE' };

    mockedAxios.get.mockResolvedValue({ data: [] });

    const result = await todoLogAPI.getLogs(params);

    expect(mockedAxios.get).toHaveBeenCalledWith('/todos/logs', { params });
    expect(result.data).toEqual([]);
  });
});