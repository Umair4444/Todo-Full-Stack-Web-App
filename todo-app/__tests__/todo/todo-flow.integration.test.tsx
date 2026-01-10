// __tests__/todo/todo-flow.integration.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';
import { TodoItem } from '@/lib/types';
import { useAppStore } from '@/lib/store';

// Mock the store
const mockAddTodo = vi.fn();
const mockToggleTodoCompletion = vi.fn();
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

describe('Todo Flow Integration', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Test Description 1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Test Description 2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as jest.MockedFunction<any>).mockReturnValue({
      actions: {
        addTodo: mockAddTodo,
        toggleTodoCompletion: mockToggleTodoCompletion,
        deleteTodo: mockDeleteTodo,
        updateTodo: mockUpdateTodo,
      },
    });
  });

  it('should add a new todo, display it in the list, and allow interaction', async () => {
    render(
      <>
        <TodoForm />
        <TodoList todos={mockTodos} />
      </>
    );

    // Add a new todo
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(titleInput, { target: { value: 'New Test Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        title: 'New Test Todo',
        description: undefined,
        completed: false,
        priority: 'medium',
      });
    });

    // Verify the new todo appears in the list
    expect(screen.getByText('New Test Todo')).toBeInTheDocument();
  });

  it('should allow toggling completion status', async () => {
    render(<TodoList todos={mockTodos} />);

    // Find the checkbox for the first (incomplete) todo
    const checkboxes = screen.getAllByRole('checkbox');
    const incompleteTodoCheckbox = checkboxes[0]; // First todo is incomplete

    // Toggle the completion status
    fireEvent.click(incompleteTodoCheckbox);

    await waitFor(() => {
      expect(mockToggleTodoCompletion).toHaveBeenCalledWith('1');
    });
  });

  it('should allow deleting a todo', async () => {
    render(<TodoList todos={mockTodos} />);

    // Find the delete button for the first todo
    const deleteButtons = screen.getAllByLabelText('Delete task');
    const firstDeleteButton = deleteButtons[0];

    fireEvent.click(firstDeleteButton);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('1');
    });
  });

  it('should allow editing a todo', async () => {
    render(<TodoList todos={mockTodos} />);

    // Find the edit button for the first todo
    const editButtons = screen.getAllByLabelText('Edit task');
    const firstEditButton = editButtons[0];

    fireEvent.click(firstEditButton);

    // Change the title
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo Title' } });

    // Click save
    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    const firstSaveButton = saveButtons[0];
    fireEvent.click(firstSaveButton);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', {
        ...mockTodos[0],
        title: 'Updated Todo Title',
        description: 'Test Description 1',
        priority: 'medium',
      });
    });
  });
});