# Data Model: Todo Full-Stack Web Application (Frontend)

**Feature**: 1-todo-frontend-app | **Date**: 2026-01-08

## Overview

This document defines the data models for the Todo Full-Stack Web Application frontend, including entity definitions, relationships, validation rules, and state management structures.

## Entity Models

### TodoItem
Represents a single todo task in the application

```typescript
interface TodoItem {
  id: string;                    // Unique identifier (UUID v4)
  title: string;                 // Title of the task (max 100 characters)
  description?: string;          // Optional description (max 500 characters)
  completed: boolean;            // Completion status (default: false)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  priority: 'low' | 'medium' | 'high'; // Priority level (default: 'medium')
  dueDate?: Date;                // Optional due date
}
```

**Validation Rules:**
- `title` must be 1-100 characters
- `description` (if provided) must be 0-500 characters
- `priority` must be one of 'low', 'medium', 'high'
- `dueDate` (if provided) must be a valid future date

### UserPreferences
Stores user-specific settings and preferences

```typescript
interface UserPreferences {
  theme: 'light' | 'dark';       // Current theme (default: 'light')
  language: 'en' | 'ur';         // Current language (default: 'en')
  notificationsEnabled: boolean; // Whether notifications are enabled (default: true)
  autoSync: boolean;             // Whether to auto-sync with backend (default: true)
}
```

**Validation Rules:**
- `theme` must be either 'light' or 'dark'
- `language` must be either 'en' (English) or 'ur' (Urdu)
- `notificationsEnabled` must be boolean
- `autoSync` must be boolean

### NavigationState
Manages the visibility state of the floating navbar

```typescript
interface NavigationState {
  isVisible: boolean;            // Whether navbar is currently visible
  lastScrollPosition: number;    // Last recorded scroll position
  scrollDirection: 'up' | 'down'; // Direction of last scroll movement
}
```

### ChatbotSession
Manages the state and context of the user's conversation with the chatbot

```typescript
interface ChatbotSession {
  sessionId: string;             // Unique session identifier
  isActive: boolean;             // Whether chatbot is currently open
  messages: ChatMessage[];       // Array of messages in the conversation
  lastActive: Date;              // Timestamp of last activity
}

interface ChatMessage {
  id: string;                    // Unique message identifier
  content: string;               // Message content
  sender: 'user' | 'bot';        // Who sent the message
  timestamp: Date;               // When the message was sent
  type: 'text' | 'quick-reply';  // Type of message
}
```

## State Management (Zustand Store)

### Application State Structure

```typescript
interface AppState {
  // Todo items state
  todos: TodoItem[];
  filteredTodos: TodoItem[];     // Todos after applying filters
  loading: boolean;              // Whether data is loading
  error: string | null;          // Error message if any
  
  // User preferences state
  preferences: UserPreferences;
  
  // Navigation state
  navState: NavigationState;
  
  // Chatbot state
  chatbot: ChatbotSession;
  
  // UI state
  currentPage: string;           // Current active page
  searchTerm: string;            // Search term for filtering todos
  filters: {
    status: 'all' | 'active' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
  };
  
  // Actions
  actions: {
    // Todo operations
    addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTodo: (id: string, updates: Partial<TodoItem>) => void;
    deleteTodo: (id: string) => void;
    toggleTodoCompletion: (id: string) => void;
    
    // Preference operations
    updateTheme: (theme: 'light' | 'dark') => void;
    updateLanguage: (language: 'en' | 'ur') => void;
    updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
    
    // Navigation operations
    updateNavVisibility: (isVisible: boolean) => void;
    updateScrollDirection: (direction: 'up' | 'down') => void;
    
    // Chatbot operations
    openChatbot: () => void;
    closeChatbot: () => void;
    sendMessage: (message: string) => void;
    addBotResponse: (response: string) => void;
    
    // UI operations
    setCurrentPage: (page: string) => void;
    setSearchTerm: (term: string) => void;
    setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
    setFilterPriority: (priority: 'all' | 'low' | 'medium' | 'high') => void;
    
    // Data operations
    loadTodos: () => Promise<void>;
    saveTodos: () => Promise<void>;
    loadPreferences: () => Promise<void>;
    savePreferences: () => Promise<void>;
  };
}
```

## Data Relationships

### TodoItem Relationships
- Each `TodoItem` is associated with the current user (implicit through localStorage)
- Related to `UserPreferences` for display settings (filtering, sorting)

### UserPreferences Relationships
- Associated with the current user session
- Influences how `TodoItem`s are displayed and filtered

### NavigationState Relationships
- Independent state that affects UI presentation
- Connected to scroll behavior of the main application

### ChatbotSession Relationships
- Independent of todo data but shares UI space
- May reference `TodoItem`s in conversations (e.g., "Show me my high priority tasks")

## Validation Rules Summary

### Business Logic Validations
1. **Title Length**: Todo titles must be 1-100 characters
2. **Description Length**: Descriptions must be 0-500 characters
3. **Priority Values**: Only 'low', 'medium', 'high' values allowed
4. **Theme Values**: Only 'light', 'dark' values allowed
5. **Language Values**: Only 'en', 'ur' values allowed
6. **Due Date Validation**: Due dates must be in the future (if provided)

### Data Integrity Validations
1. **Unique IDs**: Each TodoItem must have a unique UUID
2. **Timestamps**: createdAt and updatedAt must be valid dates
3. **Boolean Fields**: Fields declared as boolean must be true/false
4. **Required Fields**: All required fields must be present

## State Transitions

### TodoItem State Transitions
- `created` → `updated` → `completed` → `deleted`
- `created` → `updated` → `deleted`

### Navigation State Transitions
- `hidden` ↔ `visible` (based on scroll direction)

### Chatbot Session Transitions
- `inactive` → `active` → `inactive`
- `messages` can be added continuously while active

## Storage Schema

### LocalStorage Keys
- `@todos-app/todos`: JSON string of TodoItem[] array
- `@todos-app/preferences`: JSON string of UserPreferences object
- `@todos-app/chat-history`: JSON string of ChatbotSession object

### Migration Considerations
- Version the stored data to handle schema changes
- Provide migration functions for backward compatibility
- Handle missing keys gracefully with default values