// Define types based on data-model.md

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'ur';
  notificationsEnabled: boolean;
  autoSync: boolean;
}

export interface NavigationState {
  isVisible: boolean;
  lastScrollPosition: number;
  scrollDirection: 'up' | 'down';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick-reply';
}

export interface ChatbotSession {
  sessionId: string;
  isActive: boolean;
  messages: ChatMessage[];
  lastActive: Date;
}

export interface NavigationState {
  isVisible: boolean;
  lastScrollPosition: number;
  scrollDirection: 'up' | 'down';
}

export interface FilterOptions {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
}

// Define constants for validation
export const TODO_TITLE_MAX_LENGTH = 100;
export const TODO_DESCRIPTION_MAX_LENGTH = 500;

// Define priority levels
export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;

// Define status options
export const STATUS_OPTIONS = ['all', 'active', 'completed'] as const;

// Define language options
export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'اردو' }, // Urdu
];

// Define theme options
export const THEME_OPTIONS = ['light', 'dark'] as const;