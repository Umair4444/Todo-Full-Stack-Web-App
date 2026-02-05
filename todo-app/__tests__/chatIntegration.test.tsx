/**
 * Test cases for chat functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatPage from '@/src/app/chat/page';
import ChatWidget from '@/src/components/ChatWidget';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the chat service
vi.mock('@/services/chatService', () => ({
  chatService: {
    sendMessage: vi.fn(),
    getChatHistory: vi.fn(),
  },
}));

// Mock the sonner toast
vi.mock('sonner', async () => {
  const actual = await vi.importActual('sonner');
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock the next/router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ChatPage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      token: 'test-jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('allows authenticated users to submit queries and receive responses', async () => {
    // Mock the chat service response
    (chatService.sendMessage as jest.Mock).mockResolvedValue({
      response: 'This is a test response from the agent.',
      task_performed: 'GENERAL_QUERY',
      timestamp: new Date().toISOString(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Find the input field and submit button
    const inputField = screen.getByPlaceholderText(/type your message here/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Enter a message and submit
    fireEvent.change(inputField, { target: { value: 'Hello, can you help me?' } });
    fireEvent.click(submitButton);

    // Wait for the response to appear
    await waitFor(() => {
      expect(screen.getByText(/this is a test response from the agent/i)).toBeInTheDocument();
    });

    // Verify the chat service was called with the correct message
    expect(chatService.sendMessage).toHaveBeenCalledWith('Hello, can you help me?');
  });

  it('shows error when chat service fails', async () => {
    // Mock the chat service to reject
    (chatService.sendMessage as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Find the input field and submit button
    const inputField = screen.getByPlaceholderText(/type your message here/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Enter a message and submit
    fireEvent.change(inputField, { target: { value: 'This should fail' } });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/sorry, i encountered an error processing your request/i)).toBeInTheDocument();
    });
  });

  it('denies access to unauthenticated users', () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Check that the protected content is not rendered
    expect(screen.queryByText(/ai chat assistant/i)).not.toBeInTheDocument();
  });
});

describe('ChatWidget Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      token: 'test-jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('allows authenticated users to submit queries via the widget', async () => {
    // Mock the chat service response
    (chatService.sendMessage as jest.Mock).mockResolvedValue({
      response: 'This is a response from the widget.',
      task_performed: 'GENERAL_QUERY',
      timestamp: new Date().toISOString(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatWidget />
      </QueryClientProvider>
    );

    // Find and click the open button
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    // Wait for the chat widget to open and find the input field
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText(/ask me anything/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Enter a message and submit
    fireEvent.change(inputField, { target: { value: 'Hello from widget!' } });
    fireEvent.click(submitButton);

    // Wait for the response to appear
    await waitFor(() => {
      expect(screen.getByText(/this is a response from the widget/i)).toBeInTheDocument();
    });

    // Verify the chat service was called with the correct message
    expect(chatService.sendMessage).toHaveBeenCalledWith('Hello from widget!');
  });

  it('does not render for unauthenticated users', () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ChatWidget />
      </QueryClientProvider>
    );

    // Check that the widget button is not rendered
    expect(container.firstChild).toBeNull();
  });
});