// __tests__/todo/todo-item.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoItemComponent } from '@/components/todo/TodoItem';
import { TodoItem } from '@/lib/types';
import { useAppStore } from '@/lib/store';

// Mock the store
const mockToggleTodoCompletion = vi.fn().mockResolvedValue({});
const mockDeleteTodo = vi.fn();
const mockUpdateTodo = vi.fn();
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

describe('TodoItemComponent', () => {
  const mockTodo: TodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'medium',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as jest.MockedFunction<any>).mockReturnValue({
      actions: {
        toggleTodoCompletion: mockToggleTodoCompletion,
        deleteTodo: mockDeleteTodo,
        updateTodo: mockUpdateTodo,
      },
    });
  });

  it('renders correctly', () => {
    render(<TodoItemComponent todo={mockTodo} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('toggles completion status when checkbox is clicked', async () => {
    render(<TodoItemComponent todo={mockTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockToggleTodoCompletion).toHaveBeenCalledWith('1');
    });
  });

  it('enters edit mode when edit button is clicked', () => {
    render(<TodoItemComponent todo={mockTodo} />);
    
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('deletes todo when delete button is clicked', async () => {
    render(<TodoItemComponent todo={mockTodo} />);
    
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('1');
    });
  });

  it('updates todo when save button is clicked in edit mode', async () => {
    render(<TodoItemComponent todo={mockTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);

    // Change the title
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    // Click save
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', {
        ...mockTodo,
        title: 'Updated Todo',
        description: 'Test Description',
        priority: 'medium',
      });
    });
  });
});