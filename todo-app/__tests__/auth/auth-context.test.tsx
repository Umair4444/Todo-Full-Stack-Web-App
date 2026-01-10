// __tests__/auth/auth-context.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock the next/navigation useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock the fetch API
global.fetch = vi.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component to access the auth context
const TestComponent = () => {
  const { login, register, logout, user, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user-email">{user?.email || 'none'}</div>
      <button 
        onClick={() => login('test@example.com', 'password')}
        data-testid="login-btn"
      >
        Login
      </button>
      <button 
        onClick={() => register('test@example.com', 'password', 'Test User')}
        data-testid="register-btn"
      >
        Register
      </button>
      <button 
        onClick={logout}
        data-testid="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockReturnValue(undefined);
    mockLocalStorage.removeItem.mockReturnValue(undefined);
    
    // Mock successful fetch responses
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake-token' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          id: '1', 
          email: 'test@example.com', 
          name: 'Test User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
      } as Response);
  });

  it('should provide authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toBeInTheDocument();
  });

  it('should handle login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    loginBtn.click();

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });
  });

  it('should handle registration', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerBtn = screen.getByTestId('register-btn');
    registerBtn.click();

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });
  });

  it('should handle logout', async () => {
    // First, set up an authenticated state
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'authToken') return 'fake-token';
      if (key === 'user') return JSON.stringify({ 
        id: '1', 
        email: 'test@example.com', 
        name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');

    const logoutBtn = screen.getByTestId('logout-btn');
    logoutBtn.click();

    // After logout, should not be authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });
});