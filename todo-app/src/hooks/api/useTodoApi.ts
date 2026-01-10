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
    
    try {
      const newTodo = await createTodoApi(todoData);
      setTodos(prev => [...prev, newTodo]);
      toast.success('Todo created successfully');
      return newTodo;
    } catch (err) {
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
    
    try {
      const updatedTodo = await updateTodoApi(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      toast.success('Todo updated successfully');
      return updatedTodo;
    } catch (err) {
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
    
    try {
      const response = await toggleTodoCompletionApi(id);
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
    
    try {
      await deleteTodoApi(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (err) {
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