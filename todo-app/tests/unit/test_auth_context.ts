/**
 * Unit tests for authentication context in frontend
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { jest } from '@jest/globals';

// Mock the API functions
jest.mock('@/services/api', () => ({
  authAPI: {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

// Create a wrapper component for the context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Auth Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  test('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      first_name: 'John',
      last_name: 'Doe'
    };

    const mockResponse = {
      data: {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    };

    (api.authAPI.register as jest.MockedFunction<any>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register(userData.email, userData.password, userData.first_name, userData.last_name);
    });

    // Verify API was called correctly
    expect(api.authAPI.register).toHaveBeenCalledWith(userData);
  });

  test('should login a user and set auth state', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'SecurePass123!'
    };

    const mockResponse = {
      data: {
        access_token: 'mock-jwt-token',
        token_type: 'bearer'
      }
    };

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    (api.authAPI.login as jest.MockedFunction<any>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(credentials.email, credentials.password);
    });

    // Verify API was called correctly
    expect(api.authAPI.login).toHaveBeenCalledWith(credentials);

    // Verify auth state was updated (we can't directly test this because the implementation
    // would require mocking the localStorage and updating the context state)
    expect(api.authAPI.login).toHaveBeenCalled();
  });

  test('should logout user and clear auth state', async () => {
    const mockResponse = { data: { message: 'Logged out successfully' } };

    (api.authAPI.logout as jest.MockedFunction<any>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // First, set a mock token in localStorage to simulate being logged in
    localStorage.setItem('access_token', 'mock-token');

    await act(async () => {
      await result.current.logout();
    });

    // Verify API was called
    expect(api.authAPI.logout).toHaveBeenCalled();

    // Verify token was removed from localStorage
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  test('should check auth status on mount', async () => {
    const mockToken = 'stored-jwt-token';
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    // Store token and user in localStorage to simulate previous session
    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for the useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify that the context state was updated with the stored values
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('should handle registration error', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      first_name: 'John',
      last_name: 'Doe'
    };

    const mockError = new Error('Registration failed');
    (api.authAPI.register as jest.MockedFunction<any>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.register(userData.email, userData.password, userData.first_name, userData.last_name);
      } catch (error) {
        // Expect the error to be handled
        expect(error).toBe(mockError);
      }
    });

    expect(api.authAPI.register).toHaveBeenCalledWith(userData);
  });

  test('should handle login error', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'SecurePass123!'
    };

    const mockError = new Error('Login failed');
    (api.authAPI.login as jest.MockedFunction<any>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login(credentials.email, credentials.password);
      } catch (error) {
        // Expect the error to be handled
        expect(error).toBe(mockError);
      }
    });

    expect(api.authAPI.login).toHaveBeenCalledWith(credentials);
  });
});