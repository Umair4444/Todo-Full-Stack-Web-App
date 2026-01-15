// src/services/authApi.ts
import apiClient from './api';

// Define the shape of authentication responses
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Login function
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', {
    email,
    password
  });

  // Store the token in localStorage for future requests
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
  }

  return response.data;
}

// Register function
export async function register(userData: RegisterRequest): Promise<UserResponse> {
  const response = await apiClient.post('/auth/register', {
    email: userData.email,
    password: userData.password,
    first_name: userData.first_name,
    last_name: userData.last_name
  });

  return response.data;
}

// Get current user profile
export async function getCurrentUser(token: string): Promise<UserResponse> {
  const response = await apiClient.get('/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
}

// Logout function (client-side only)
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if the backend logout fails, we should clear the local token
    console.error('Logout error:', error);
  } finally {
    // Always clear the local token
    localStorage.removeItem('access_token');
  }
}