// __tests__/auth/auth-flow.integration.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';

// Mock the next/navigation useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the fetch API
global.fetch = vi.fn();

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Test component to access auth state
const AuthStatusDisplay = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
      <div data-testid="loading-status">{loading ? 'loading' : 'loaded'}</div>
      {user && (
        <div data-testid="user-email">{user.email}</div>
      )}
    </div>
  );
};

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockReturnValue(undefined);
    mockLocalStorage.removeItem.mockReturnValue(undefined);
    
    // Reset fetch mock
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockClear();
  });

  it('should register a new user, then login, then logout', async () => {
    // Mock successful responses for registration
    const mockFetch = global.fetch as jest.MockedFunction<typeof global.fetch>;
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', email: 'test@example.com', name: 'Test User', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }) }) // Register response
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'fake-token' }) }) // Login response (after registration)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', email: 'test@example.com', name: 'Test User', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }) }); // Profile response

    render(
      <AuthProvider>
        <AuthStatusDisplay />
        <RegistrationForm />
      </AuthProvider>
    );

    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');

    // Fill and submit registration form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for registration to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Verify user email is displayed
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');

    // Now test logout by rendering a component that can trigger logout
    const LogoutTestComponent = () => {
      const { logout } = useAuth();
      return <button onClick={logout} data-testid="logout-btn">Logout</button>;
    };

    render(
      <AuthProvider>
        <AuthStatusDisplay />
        <LogoutTestComponent />
      </AuthProvider>
    );

    // Click logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    // Wait for logout to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
    });
  });

  it('should login with existing credentials', async () => {
    // Mock successful login responses
    const mockFetch = global.fetch as jest.MockedFunction<typeof global.fetch>;
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'fake-token' }) }) // Login response
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', email: 'test@example.com', name: 'Test User', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }) }); // Profile response

    render(
      <AuthProvider>
        <AuthStatusDisplay />
        <LoginForm />
      </AuthProvider>
    );

    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');

    // Fill and submit login form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Verify user email is displayed
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });
});