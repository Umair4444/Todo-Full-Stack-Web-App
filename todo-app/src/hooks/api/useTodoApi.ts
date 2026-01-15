// src/hooks/api/useTodoApi.ts
import { useState, useEffect } from 'react';
import { TodoItem } from '@/lib/types';
import { 
  getTodos as getTodosApi, 
  createTodo as createTodoApi, 
  updateTodo as updateTodoApi, 
  deleteTodo as deleteTodoApi, 
  toggleTodoCompletion as toggleTodoCompletionApi 
} from '@/services/todoApi';
import { toast } from 'sonner';

export const useTodoApi = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos
  const fetchTodos = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTodosApi(page, limit);
      setTodos(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  // Create a new todo
  const createTodo = async (todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    // Create a temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempTodo: TodoItem = {
      ...todoData,
      id: tempId,
      completed: todoData.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the temporary todo to the UI immediately (optimistic update)
    setTodos(prev => [...prev, tempTodo]);

    try {
      const newTodo = await createTodoApi(todoData);

      // Replace the temporary todo with the actual one from the server
      setTodos(prev =>
        prev.map(todo =>
          todo.id === tempId ? newTodo : todo
        )
      );

      toast.success('Todo created successfully');
      return newTodo;
    } catch (err) {
      // Remove the temporary todo if the API call failed
      setTodos(prev => prev.filter(todo => todo.id !== tempId));

      setError(err instanceof Error ? err.message : 'Failed to create todo');
      toast.error('Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing todo
  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    setLoading(true);
    setError(null);

    // Find the current todo and store the original for potential rollback
    const originalTodo = todos.find(todo => todo.id === id);
    if (!originalTodo) {
      throw new Error('Todo not found');
    }

    // Optimistically update the todo in the UI
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );

    try {
      const updatedTodo = await updateTodoApi(id, updates);

      // Update with the server response to ensure consistency
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );

      toast.success('Todo updated successfully');
      return updatedTodo;
    } catch (err) {
      // Rollback to the original todo if the API call failed
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError(err instanceof Error ? err.message : 'Failed to update todo');
      toast.error('Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodoCompletion = async (id: string) => {
    setLoading(true);
    setError(null);

    // Find the current todo and store the original for potential rollback
    const originalTodo = todos.find(todo => todo.id === id);
    if (!originalTodo) {
      throw new Error('Todo not found');
    }

    // Optimistically toggle the completion status in the UI
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );

    try {
      const response = await toggleTodoCompletionApi(id);

      // Update with the server response to ensure consistency
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id
            ? { ...todo, completed: response.completed, updatedAt: new Date(response.updatedAt) }
            : todo
        )
      );

      toast.success(response.completed ? 'Todo marked as complete' : 'Todo marked as active');
      return response;
    } catch (err) {
      // Rollback to the original state if the API call failed
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError(err instanceof Error ? err.message : 'Failed to toggle todo completion');
      toast.error('Failed to update todo status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);

    // Optimistically remove the todo from the UI
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) {
      throw new Error('Todo not found');
    }

    setTodos(prev => prev.filter(todo => todo.id !== id));

    try {
      await deleteTodoApi(id);
      toast.success('Todo deleted successfully');
    } catch (err) {
      // Restore the todo if the API call failed
      setTodos(prev => [...prev, todoToDelete]);

      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      toast.error('Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo,
  };
};