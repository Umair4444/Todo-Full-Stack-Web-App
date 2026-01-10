// __tests__/api/api-e2e.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTodoApi } from '@/hooks/api/useTodoApi';
import { TodoItem } from '@/lib/types';

// Mock the todo API functions
const mockGetTodos = vi.fn();
const mockCreateTodo = vi.fn();
const mockUpdateTodo = vi.fn();
const mockDeleteTodo = vi.fn();
const mockToggleTodoCompletion = vi.fn();

vi.mock('@/services/todoApi', () => ({
  getTodos: (page: number, limit: number) => mockGetTodos(page, limit),
  createTodo: (data: any) => mockCreateTodo(data),
  updateTodo: (id: string, data: any) => mockUpdateTodo(id, data),
  deleteTodo: (id: string) => mockDeleteTodo(id),
  toggleTodoCompletion: (id: string) => mockToggleTodoCompletion(id),
}));

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('API Integration End-to-End', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTodos.mockClear();
    mockCreateTodo.mockClear();
    mockUpdateTodo.mockClear();
    mockDeleteTodo.mockClear();
    mockToggleTodoCompletion.mockClear();
  });

  it('should perform complete todo lifecycle', async () => {
    // Initial state: no todos
    const initialTodos = { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
    mockGetTodos.mockResolvedValue(initialTodos);

    const { result } = renderHook(() => useTodoApi());

    // Step 1: Fetch initial todos (should be empty)
    await act(async () => {
      await result.current.fetchTodos();
    });

    await waitFor(() => {
      expect(result.current.todos).toEqual([]);
    });

    // Step 2: Create a new todo
    const newTodoData = { 
      title: 'Test Todo', 
      description: 'Test Description', 
      completed: false, 
      priority: 'medium' as const 
    };
    
    const createdTodo = { 
      id: '1', 
      ...newTodoData, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as TodoItem;
    
    mockCreateTodo.mockResolvedValue(createdTodo);

    let createResult: TodoItem | undefined;
    await act(async () => {
      createResult = await result.current.createTodo(newTodoData);
    });

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith(newTodoData);
      expect(result.current.todos).toContainEqual(createdTodo);
      expect(createResult).toEqual(createdTodo);
    });

    // Step 3: Update the todo
    const updatedTodoData = { ...createdTodo, title: 'Updated Test Todo', completed: true };
    mockUpdateTodo.mockResolvedValue(updatedTodoData);

    let updateResult: TodoItem | undefined;
    await act(async () => {
      updateResult = await result.current.updateTodo('1', { title: 'Updated Test Todo', completed: true });
    });

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', { title: 'Updated Test Todo', completed: true });
      expect(result.current.todos).toContainEqual(updatedTodoData);
      expect(updateResult).toEqual(updatedTodoData);
    });

    // Step 4: Toggle completion status
    const toggleResponse = { id: '1', completed: false, updatedAt: new Date().toISOString() };
    mockToggleTodoCompletion.mockResolvedValue(toggleResponse);

    await act(async () => {
      await result.current.toggleTodoCompletion('1');
    });

    await waitFor(() => {
      expect(mockToggleTodoCompletion).toHaveBeenCalledWith('1');
      expect(result.current.todos[0].completed).toBe(false);
    });

    // Step 5: Delete the todo
    mockDeleteTodo.mockResolvedValue(undefined);

    await act(async () => {
      await result.current.deleteTodo('1');
    });

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('1');
      expect(result.current.todos).toEqual([]);
    });

    // Verify all API calls were made
    expect(mockCreateTodo).toHaveBeenCalledTimes(1);
    expect(mockUpdateTodo).toHaveBeenCalledTimes(1);
    expect(mockToggleTodoCompletion).toHaveBeenCalledTimes(1);
    expect(mockDeleteTodo).toHaveBeenCalledTimes(1);
  });

  it('should handle error scenarios gracefully', async () => {
    // Mock error for create operation
    const createErrorMessage = 'Failed to create todo';
    mockCreateTodo.mockRejectedValue(new Error(createErrorMessage));

    const { result } = renderHook(() => useTodoApi());

    // Try to create a todo and expect an error
    await act(async () => {
      try {
        await result.current.createTodo({ 
          title: 'Failing Todo', 
          completed: false, 
          priority: 'medium' as const 
        });
      } catch (error) {
        // Error is expected and handled by the hook
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe(createErrorMessage);
    });

    // Reset error state
    mockCreateTodo.mockClear();
    const successTodo = { 
      id: '2', 
      title: 'Successful Todo', 
      completed: false, 
      priority: 'medium' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    } as TodoItem;
    mockCreateTodo.mockResolvedValue(successTodo);

    // Now try a successful operation
    await act(async () => {
      await result.current.createTodo({ 
        title: 'Successful Todo', 
        completed: false, 
        priority: 'medium' as const 
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.todos).toContainEqual(successTodo);
    });
  });

  it('should maintain loading states correctly', async () => {
    // Mock a slow API call
    mockGetTodos.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } });
        }, 100);
      });
    });

    const { result } = renderHook(() => useTodoApi());

    // Start the fetch operation
    const fetchPromise = act(async () => {
      await result.current.fetchTodos();
    });

    // Check that loading is true during the operation
    expect(result.current.loading).toBe(true);

    // Wait for the operation to complete
    await fetchPromise;

    // Check that loading is false after the operation
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});