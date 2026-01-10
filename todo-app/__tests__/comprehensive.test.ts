// __tests__/comprehensive.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTodoApi } from '@/hooks/api/useTodoApi';
import { useAppStore } from '@/lib/store';
import { TodoItem } from '@/lib/types';
import { useApi } from '@/hooks/api/useApi';

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

describe('Comprehensive Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTodos.mockClear();
    mockCreateTodo.mockClear();
    mockUpdateTodo.mockClear();
    mockDeleteTodo.mockClear();
    mockToggleTodoCompletion.mockClear();
  });

  describe('API Integration Tests', () => {
    it('should handle complete todo lifecycle', async () => {
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

    it('should handle API errors gracefully', async () => {
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
    });
  });

  describe('State Management Tests', () => {
    it('should manage todo state correctly', () => {
      const { result } = renderHook(() => useAppStore());

      // Check initial state
      expect(result.current.todos).toEqual([]);
      expect(result.current.loading).toBe(false);

      // Simulate adding a todo
      const newTodo = {
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
      } as TodoItem;

      act(() => {
        result.current.actions.addTodo({
          title: 'Test Todo',
          description: 'Test Description',
          completed: false,
          priority: 'medium',
        });
      });

      // Check that the todo was added
      expect(result.current.todos).toContainEqual(expect.objectContaining({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
      }));

      // Test updating a todo
      act(() => {
        result.current.actions.updateTodo('1', { completed: true });
      });

      // Check that the todo was updated
      const updatedTodo = result.current.todos.find(todo => todo.id === '1');
      expect(updatedTodo?.completed).toBe(true);

      // Test deleting a todo
      act(() => {
        result.current.actions.deleteTodo('1');
      });

      // Check that the todo was removed
      expect(result.current.todos).toHaveLength(0);
    });

    it('should manage user preferences correctly', () => {
      const { result } = renderHook(() => useAppStore());

      // Check initial preferences
      expect(result.current.preferences.theme).toBe('light');
      expect(result.current.preferences.language).toBe('en');

      // Update theme
      act(() => {
        result.current.actions.updateTheme('dark');
      });

      // Check that theme was updated
      expect(result.current.preferences.theme).toBe('dark');

      // Update language
      act(() => {
        result.current.actions.updateLanguage('ur');
      });

      // Check that language was updated
      expect(result.current.preferences.language).toBe('ur');
    });
  });

  describe('API Hook Tests', () => {
    it('should execute API calls correctly', async () => {
      const testData = { id: 1, name: 'Test' };
      const mockApiFunction = vi.fn().mockResolvedValue(testData);

      const { result } = renderHook(() => useApi(mockApiFunction));

      // Execute the API call
      const returnedData = await act(async () => {
        return await result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(testData);
        expect(returnedData).toEqual(testData);
      });
    });

    it('should handle API errors in useApi hook', async () => {
      const errorMessage = 'API Error';
      const mockApiFunction = vi.fn().mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });
});