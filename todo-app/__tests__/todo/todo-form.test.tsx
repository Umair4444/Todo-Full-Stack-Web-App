// __tests__/todo/todo-form.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoForm from '@/components/todo/TodoForm';
import { useAppStore } from '@/lib/store';

// Mock the store
const mockAddTodo = vi.fn();
vi.mock('@/lib/store', () => ({
  useAppStore: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as jest.MockedFunction<any>).mockReturnValue({
      actions: {
        addTodo: mockAddTodo,
      },
    });
  });

  it('renders correctly', () => {
    render(<TodoForm />);
    
    expect(screen.getByRole('heading', { name: /add new task/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls addTodo when form is submitted with valid data', async () => {
    render(<TodoForm />);
    
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    const descriptionInput = screen.getByPlaceholderText(/add details/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        title: 'Test task',
        description: 'Test description',
        completed: false,
        priority: 'medium',
      });
    });
  });

  it('shows error when title is empty', async () => {
    render(<TodoForm />);
    
    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    render(<TodoForm />);
    
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    const descriptionInput = screen.getByPlaceholderText(/add details/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });
});