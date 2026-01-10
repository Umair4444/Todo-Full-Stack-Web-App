// __tests__/api/api-integration.integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodoApi } from '@/hooks/api/useTodoApi';
import { renderHook, waitFor, act } from '@testing-library/react';
import { TodoItem } from '@/lib/types';

// Mock the todo API functions
const mockGetTodos = vi.fn();
const mockCreateTodo = vi.fn();
const mockUpdateTodo = vi.fn();
const mockDeleteTodo = vi.fn();
const mockToggleTodoCompletion = vi.fn();

vi.mock('@/services/todoApi', () => ({
  getTodos: () => mockGetTodos(),
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

describe('useTodoApi Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTodos.mockClear();
    mockCreateTodo.mockClear();
    mockUpdateTodo.mockClear();
    mockDeleteTodo.mockClear();
    mockToggleTodoCompletion.mockClear();
  });

  it('should fetch todos successfully', async () => {
    const todos = [
      { id: '1', title: 'Test Todo', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }
    ] as TodoItem[];
    
    mockGetTodos.mockResolvedValue({ items: todos, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } });

    const { result } = renderHook(() => useTodoApi());

    await act(async () => {
      await result.current.fetchTodos();
    });

    await waitFor(() => {
      expect(result.current.todos).toEqual(todos);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should create a new todo', async () => {
    const newTodo = { id: '1', title: 'New Todo', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' } as TodoItem;
    const todoData = { title: 'New Todo', completed: false, priority: 'medium' } as any;
    
    mockCreateTodo.mockResolvedValue(newTodo);

    const { result } = renderHook(() => useTodoApi());

    await act(async () => {
      await result.current.createTodo(todoData);
    });

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith(todoData);
      expect(result.current.todos).toContainEqual(newTodo);
    });
  });

  it('should update an existing todo', async () => {
    const initialTodos = [
      { id: '1', title: 'Old Title', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }
    ] as TodoItem[];
    
    const updatedTodo = { 
      id: '1', 
      title: 'Updated Title', 
      completed: true, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      priority: 'high' 
    } as TodoItem;
    
    mockGetTodos.mockResolvedValue({ items: initialTodos, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } });
    mockUpdateTodo.mockResolvedValue(updatedTodo);

    const { result } = renderHook(() => useTodoApi());

    // First fetch the todos
    await act(async () => {
      await result.current.fetchTodos();
    });

    // Then update the todo
    await act(async () => {
      await result.current.updateTodo('1', { title: 'Updated Title', completed: true, priority: 'high' });
    });

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', { title: 'Updated Title', completed: true, priority: 'high' });
      expect(result.current.todos).toContainEqual(updatedTodo);
    });
  });

  it('should delete a todo', async () => {
    const initialTodos = [
      { id: '1', title: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' },
      { id: '2', title: 'Todo 2', completed: true, createdAt: new Date(), updatedAt: new Date(), priority: 'low' }
    ] as TodoItem[];
    
    mockGetTodos.mockResolvedValue({ items: initialTodos, pagination: { page: 1, limit: 10, total: 2, totalPages: 1 } });
    mockDeleteTodo.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodoApi());

    // First fetch the todos
    await act(async () => {
      await result.current.fetchTodos();
    });

    // Then delete the first todo
    await act(async () => {
      await result.current.deleteTodo('1');
    });

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('1');
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('2');
    });
  });

  it('should toggle todo completion status', async () => {
    const initialTodos = [
      { id: '1', title: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }
    ] as TodoItem[];
    
    const toggleResponse = { id: '1', completed: true, updatedAt: new Date().toISOString() };
    
    mockGetTodos.mockResolvedValue({ items: initialTodos, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } });
    mockToggleTodoCompletion.mockResolvedValue(toggleResponse);

    const { result } = renderHook(() => useTodoApi());

    // First fetch the todos
    await act(async () => {
      await result.current.fetchTodos();
    });

    // Then toggle the completion status
    await act(async () => {
      await result.current.toggleTodoCompletion('1');
    });

    await waitFor(() => {
      expect(mockToggleTodoCompletion).toHaveBeenCalledWith('1');
      expect(result.current.todos[0].completed).toBe(true);
    });
  });

  it('should handle errors when fetching todos', async () => {
    const errorMessage = 'Failed to fetch todos';
    mockGetTodos.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTodoApi());

    await act(async () => {
      await result.current.fetchTodos();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });
});