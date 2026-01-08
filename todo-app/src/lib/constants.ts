// Application constants

// Storage keys
export const STORAGE_KEYS = {
  TODOS: '@todos-app/todos',
  PREFERENCES: '@todos-app/preferences',
  CHAT_HISTORY: '@todos-app/chat-history',
  NAVIGATION_STATE: '@todos-app/nav-state',
} as const;

// API endpoints (for future backend connection)
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  HEALTH: '/health',
  TODOS: '/todos',
  PREFERENCES: '/preferences',
} as const;

// Default values
export const DEFAULT_VALUES = {
  THEME: 'light',
  LANGUAGE: 'en',
  NOTIFICATIONS_ENABLED: true,
  AUTO_SYNC: true,
  PAGE_SIZE: 10,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_TITLE: 'Title must be between 1 and 100 characters',
  INVALID_DESCRIPTION: 'Description must be less than 500 characters',
  INVALID_PRIORITY: 'Priority must be low, medium, or high',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TODO_ADDED: 'Todo added successfully',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FADE_IN: 300,
  SLIDE_IN: 250,
  TRANSITION: 200,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px',
} as const;

// Priority colors
export const PRIORITY_COLORS = {
  low: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100',
} as const;

// Status colors
export const STATUS_COLORS = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
} as const;