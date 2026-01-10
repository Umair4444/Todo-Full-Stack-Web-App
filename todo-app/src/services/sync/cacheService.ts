// src/services/sync/cacheService.ts
import { TodoItem } from '@/lib/types';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 100; // Maximum number of items to cache

// Types for cache entries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Service for caching data to improve performance
 */
class CacheService {
  private static cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get cached data by key
   */
  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache
   */
  static set<T>(key: string, data: T): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Delete data from cache
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cached todo items
   */
  static getAllTodos(): TodoItem[] {
    const todos: TodoItem[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith('todo-') && Array.isArray(entry.data)) {
        todos.push(...entry.data);
      } else if (key.startsWith('todo-') && typeof entry.data === 'object' && entry.data.id) {
        todos.push(entry.data);
      }
    }

    return todos;
  }

  /**
   * Cache todo list
   */
  static cacheTodoList(todos: TodoItem[], userId: string): void {
    const key = `todo-list-${userId}`;
    this.set(key, {
      items: todos,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached todo list
   */
  static getCachedTodoList(userId: string): TodoItem[] | null {
    const key = `todo-list-${userId}`;
    const entry = this.get<any>(key);
    
    if (!entry || !entry.items) {
      return null;
    }

    return entry.items;
  }

  /**
   * Cache a single todo item
   */
  static cacheTodo(todo: TodoItem): void {
    const key = `todo-${todo.id}`;
    this.set(key, todo);
  }

  /**
   * Get cached todo item
   */
  static getCachedTodo(todoId: string): TodoItem | null {
    const key = `todo-${todoId}`;
    return this.get<TodoItem>(key);
  }

  /**
   * Invalidate todo cache
   */
  static invalidateTodoCache(todoId: string): void {
    this.delete(`todo-${todoId}`);
  }

  /**
   * Invalidate todo list cache
   */
  static invalidateTodoListCache(userId: string): void {
    this.delete(`todo-list-${userId}`);
  }

  /**
   * Get cache statistics
   */
  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default CacheService;