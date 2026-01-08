// Service for managing local storage operations
import { TodoItem, UserPreferences, ChatbotSession } from './types';

// Generic function to get item from localStorage
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    // Server-side rendering, return null
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage with key: ${key}`, error);
    return null;
  }
}

// Generic function to set item in localStorage
export function setItem(key: string, value: any): void {
  if (typeof window === 'undefined') {
    // Server-side rendering, do nothing
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage with key: ${key}`, error);
  }
}

// Generic function to remove item from localStorage
export function removeItem(key: string): void {
  if (typeof window === 'undefined') {
    // Server-side rendering, do nothing
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage with key: ${key}`, error);
  }
}

// Specific functions for todo items
export function getTodos(): TodoItem[] {
  return getItem<TodoItem[]>('@todos-app/todos') || [];
}

export function setTodos(todos: TodoItem[]): void {
  setItem('@todos-app/todos', todos);
}

// Specific functions for user preferences
export function getPreferences(): UserPreferences {
  return getItem<UserPreferences>('@todos-app/preferences') || {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    autoSync: true,
  };
}

export function setPreferences(preferences: UserPreferences): void {
  setItem('@todos-app/preferences', preferences);
}

// Specific functions for chatbot session
export function getChatHistory(): ChatbotSession {
  return getItem<ChatbotSession>('@todos-app/chat-history') || {
    sessionId: '',
    isActive: false,
    messages: [],
    lastActive: new Date(),
  };
}

export function setChatHistory(chatHistory: ChatbotSession): void {
  setItem('@todos-app/chat-history', chatHistory);
}

// Clear all stored data
export function clearAllStorage(): void {
  if (typeof window === 'undefined') {
    // Server-side rendering, do nothing
    return;
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}

// Check if localStorage is available
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}