// __tests__/auth/redirect-if-authenticated.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';
import { useRouter } from 'next/navigation';

// Mock the next/navigation useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock component to test the hook
const MockComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
      <span data-testid="loading-status">{isLoading ? 'loading' : 'loaded'}</span>
      <div>Mock Child Component</div>
    </div>
  );
};

describe('RedirectIfAuthenticated', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it('should render children when user is not authenticated', () => {
    // Mock the AuthContext to return not authenticated
    const mockValue = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthStatus: vi.fn(),
      updateUser: vi.fn(),
    };

    render(
      <AuthProvider initialValue={mockValue}>
        <RedirectIfAuthenticated redirectTo="/dashboard">
          <MockComponent />
        </RedirectIfAuthenticated>
      </AuthProvider>
    );

    // Verify that the child component is rendered
    expect(screen.getByText('Mock Child Component')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loaded');

    // Verify that router.replace was not called
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should redirect when user is authenticated', async () => {
    // Mock the AuthContext to return authenticated
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockValue = {
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthStatus: vi.fn(),
      updateUser: vi.fn(),
    };

    render(
      <AuthProvider initialValue={mockValue}>
        <RedirectIfAuthenticated redirectTo="/dashboard">
          <MockComponent />
        </RedirectIfAuthenticated>
      </AuthProvider>
    );

    // Wait for the useEffect to run
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show loading state when auth is loading', () => {
    // Mock the AuthContext to return loading state
    const mockValue = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Loading state
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthStatus: vi.fn(),
      updateUser: vi.fn(),
    };

    render(
      <AuthProvider initialValue={mockValue}>
        <RedirectIfAuthenticated redirectTo="/dashboard">
          <div>Mock Child Component</div>
        </RedirectIfAuthenticated>
      </AuthProvider>
    );

    // Verify that loading state is shown
    expect(screen.getByText('Checking authentication status...')).toBeInTheDocument();
  });

  it('should redirect to default path when redirectTo is not provided', async () => {
    // Mock the AuthContext to return authenticated
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockValue = {
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthStatus: vi.fn(),
      updateUser: vi.fn(),
    };

    render(
      <AuthProvider initialValue={mockValue}>
        <RedirectIfAuthenticated>
          <MockComponent />
        </RedirectIfAuthenticated>
      </AuthProvider>
    );

    // Wait for the useEffect to run and check default redirect
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });
});