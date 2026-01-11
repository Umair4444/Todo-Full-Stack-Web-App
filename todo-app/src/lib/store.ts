import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { TodoItem, UserPreferences, ChatMessage, ChatbotSession, NavigationState } from './types'; // Import types from types.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  // Todo items state
  todos: TodoItem[];
  filteredTodos: TodoItem[];
  loading: boolean;
  error: string | null;

  // User preferences state
  preferences: UserPreferences;

  // Authentication state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Navigation state
  navState: NavigationState;

  // Chatbot state
  chatbot: ChatbotSession;

  // UI state
  currentPage: string;
  searchTerm: string;
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

    // Authentication operations
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;

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

    // Chat history operations
    loadChatHistory: () => Promise<void>;
    saveChatHistory: () => Promise<void>;

    // Data sync operations
    syncTodosWithServer: () => Promise<void>;
    bulkDeleteTodos: (ids: string[]) => Promise<{ deleted_count: number; requested_count: number } | undefined>;
    enableOfflineMode: () => void;
    disableOfflineMode: () => void;
    isOfflineMode: () => boolean;
  };
}

// Initial state
const initialState: Omit<AppState, 'actions'> = {
  // Todo items state
  todos: [],
  filteredTodos: [],
  loading: false,
  error: null,

  // User preferences state
  preferences: {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    autoSync: true,
  },

  // Authentication state
  user: null,
  token: null,
  isAuthenticated: false,

  // Navigation state
  navState: {
    isVisible: true,
    lastScrollPosition: 0,
    scrollDirection: 'up',
  },

  // Chatbot state
  chatbot: {
    sessionId: uuidv4(),
    isActive: false,
    messages: [],
    lastActive: new Date(),
  },

  // UI state
  currentPage: 'home',
  searchTerm: '',
  filters: {
    status: 'all',
    priority: 'all',
  },
};

// Custom serializer/deserializer for dates
const dateDeserializer = (state: any): AppState => {
  if (!state || typeof state !== 'object') return state;

  const newState = { ...state };

  if (newState.todos && Array.isArray(newState.todos)) {
    newState.todos = newState.todos.map((todo: TodoItem) => ({
      ...todo,
      createdAt: typeof todo.createdAt === 'string' ? new Date(todo.createdAt) : todo.createdAt,
      updatedAt: typeof todo.updatedAt === 'string' ? new Date(todo.updatedAt) : todo.updatedAt,
      dueDate: todo.dueDate ? (typeof todo.dueDate === 'string' ? new Date(todo.dueDate) : todo.dueDate) : todo.dueDate,
    }));
  }

  if (newState.user) {
    newState.user = {
      ...newState.user,
      createdAt: typeof newState.user.createdAt === 'string' ? new Date(newState.user.createdAt) : newState.user.createdAt,
      updatedAt: typeof newState.user.updatedAt === 'string' ? new Date(newState.user.updatedAt) : newState.user.updatedAt,
    };
  }

  if (newState.chatbot && newState.chatbot.messages && Array.isArray(newState.chatbot.messages)) {
    newState.chatbot.messages = newState.chatbot.messages.map((message: ChatMessage) => ({
      ...message,
      timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp,
    }));
  }

  if (newState.chatbot && newState.chatbot.lastActive) {
    newState.chatbot.lastActive = typeof newState.chatbot.lastActive === 'string' ? new Date(newState.chatbot.lastActive) : newState.chatbot.lastActive;
  }

  return newState;
};

export const useAppStore = create<AppState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      actions: {
        // Todo operations
        addTodo: async (todo) => {
          set({ loading: true });
          try {
            // Sanitize and validate input
            const sanitizedTitle = todo.title ? todo.title.trim() : '';
            if (!sanitizedTitle) {
              throw new Error('Todo title is required');
            }

            if (sanitizedTitle.length > 100) {
              throw new Error('Todo title must be less than 100 characters');
            }

            // Prevent XSS by sanitizing title and description
            const cleanTitle = sanitizedTitle.replace(/[<>]/g, '');
            const cleanDescription = todo.description ? todo.description.replace(/[<>]/g, '') : undefined;

            if (cleanDescription && cleanDescription.length > 500) {
              throw new Error('Todo description must be less than 500 characters');
            }

            // Create new todo with backend API
            const newTodo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> = {
              ...todo,
              title: cleanTitle,
              description: cleanDescription,
            };

            // Call backend API
            const createdTodo = await import('../services/todoApi').then(api => api.createTodo(newTodo));

            // Update state with new todo
            set((state) => ({
              ...state,
              todos: [...state.todos, createdTodo],
              error: null,
              loading: false,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
              loading: false,
            }));
          }
        },

        updateTodo: async (id, updates) => {
          // Optimistically update the local state immediately
          set((state) => ({
            ...state,
            todos: state.todos.map(todo =>
              todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
            ),
          }));

          try {
            // Validate updates if they exist
            if (updates.title && updates.title.length > 100) {
              throw new Error('Todo title must be less than 100 characters');
            }

            if (updates.description && updates.description.length > 500) {
              throw new Error('Todo description must be less than 500 characters');
            }

            // Update the todo with the backend API
            const updatedTodo = await import('../services/todoApi').then(api => api.updateTodo(id, updates));

            // Update with the server response to ensure consistency
            set((state) => ({
              ...state,
              todos: state.todos.map(todo =>
                todo.id === id ? updatedTodo : todo
              ),
              error: null,
            }));
          } catch (error) {
            // Handle error by showing a toast and reverting the optimistic update
            // Note: In a real app, you might want to keep the optimistic update and show an error indicator
            // For now, we'll show the error but keep the optimistic update
            console.error('Error updating todo:', error);
          }
        },

        deleteTodo: async (id) => {
          set({ loading: true });
          try {
            // Delete the todo with the backend API
            await import('../services/todoApi').then(api => api.deleteTodo(id));

            // Remove the todo with the specified ID
            set((state) => ({
              ...state,
              todos: state.todos.filter(todo => todo.id !== id),
              error: null,
              loading: false,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
              loading: false,
            }));
          }
        },

        toggleTodoCompletion: async (id) => {
          // Optimistically update the local state immediately
          set((state) => ({
            ...state,
            todos: state.todos.map(todo =>
              todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
            ),
          }));

          try {
            // Toggle the completion status of the specified todo
            const result = await import('../services/todoApi').then(api => api.toggleTodoCompletion(id));

            // Update with the server response to ensure consistency
            set((state) => ({
              ...state,
              todos: state.todos.map(todo =>
                todo.id === id ? { ...todo, completed: result.completed, updatedAt: new Date(result.updatedAt) } : todo
              ),
              error: null,
            }));
          } catch (error) {
            // Handle error by showing an error message
            console.error('Error toggling todo completion:', error);
          }
        },

        // Preference operations
        updateTheme: (theme) => set((state) => {
          // Update the theme in preferences
          const updatedPreferences = { ...state.preferences, theme };

          // Update the theme in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('todo-app-theme', theme);
          }

          return {
            ...state,
            preferences: updatedPreferences,
          };
        }),

        updateLanguage: (language) => set((state) => {
          // Update the language in preferences
          const updatedPreferences = { ...state.preferences, language };

          // Update the language in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('todo-app-language', language);
          }

          return {
            ...state,
            preferences: updatedPreferences,
          };
        }),

        updateUserPreferences: (prefs) => set((state) => ({
          ...state,
          preferences: { ...state.preferences, ...prefs },
        })),

        // Authentication operations (currently using mock authentication since backend auth is not implemented)
        login: async (email, password) => {
          set({ loading: true });
          try {
            // For now, we'll simulate authentication since the backend doesn't have auth endpoints yet
            // In a real implementation, this would call the backend auth API
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            // In a real implementation, we would get user data from the backend
            // For now, we'll create a mock user with just the email
            const mockUser = {
              id: '1',
              email,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set({
              user: mockUser,
              token: 'mock-jwt-token-for-now',
              isAuthenticated: true,
              loading: false,
            });

            // Store in localStorage for persistence
            localStorage.setItem('authToken', 'mock-jwt-token-for-now');
            localStorage.setItem('user', JSON.stringify(mockUser));
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
            throw error; // Re-throw so calling code can handle it
          }
        },

        register: async (email, password, name) => {
          set({ loading: true });
          try {
            // For now, we'll simulate registration since the backend doesn't have auth endpoints yet
            // In a real implementation, this would call the backend auth API
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            // Create a mock user
            const mockUser = {
              id: '1',
              email,
              name: name || email.split('@')[0] || 'User',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set({
              user: mockUser,
              token: 'mock-jwt-token-for-now',
              isAuthenticated: true,
              loading: false,
            });

            // Store in localStorage for persistence
            localStorage.setItem('authToken', 'mock-jwt-token-for-now');
            localStorage.setItem('user', JSON.stringify(mockUser));
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
            throw error; // Re-throw so calling code can handle it
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });

          // Remove from localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        },

        updateUser: (userData) => set((state) => ({
          ...state,
          user: { ...state.user, ...userData } as User,
        })),

        // Navigation operations
        updateNavVisibility: (isVisible) => set((state) => ({
          ...state,
          navState: { ...state.navState, isVisible },
        })),

        // Data sync operations
        syncTodosWithServer: async () => {
          set({ loading: true });
          try {
            // Load todos from backend API to sync
            const { getTodos } = await import('../services/todoApi');
            const result = await getTodos(1, 100); // Get first 100 todos

            // Update the state with synced todos
            set(state => ({
              ...state,
              todos: result.items,
              loading: false
            }));
          } catch (error) {
            set(state => ({
              ...state,
              loading: false,
              error: (error as Error).message
            }));
            throw error;
          }
        },

        // Bulk delete todos
        bulkDeleteTodos: async (ids: string[]) => {
          set({ loading: true });
          try {
            // Delete todos with the backend API
            const { bulkDeleteTodos } = await import('../services/todoApi');
            const result = await bulkDeleteTodos(ids);

            // Remove the deleted todos from the local state
            set((state) => ({
              ...state,
              todos: state.todos.filter(todo => !ids.includes(todo.id)),
              error: null,
              loading: false,
            }));

            // Return the result for potential UI feedback
            return result;
          } catch (error) {
            set((state) => ({
              ...state,
              error: (error as Error).message,
              loading: false,
            }));
            throw error;
          }
        },

        enableOfflineMode: () => {
          // In a real implementation, you would set offline mode
          // For now, we'll just update a flag in state if we had one
          console.log('Offline mode enabled');
        },

        disableOfflineMode: () => {
          // In a real implementation, you would disable offline mode
          console.log('Offline mode disabled');
        },

        isOfflineMode: () => {
          // In a real implementation, you would check the actual offline status
          return !navigator.onLine;
        },
        
        updateScrollDirection: (direction) => set((state) => ({
          ...state,
          navState: { ...state.navState, scrollDirection: direction },
        })),

        // Chatbot operations
        openChatbot: () => set((state) => ({
          ...state,
          chatbot: { ...state.chatbot, isActive: true, lastActive: new Date() },
        })),
        
        closeChatbot: () => set((state) => ({
          ...state,
          chatbot: { ...state.chatbot, isActive: false },
        })),
        
        sendMessage: (message) => set((state) => {
          const newMessage: ChatMessage = {
            id: uuidv4(),
            content: message,
            sender: 'user',
            timestamp: new Date(),
            type: 'text',
          };
          
          // Simple bot response logic
          const botResponse: ChatMessage = {
            id: uuidv4(),
            content: `I received your message: "${message}". This is a simulated response from the todo app chatbot.`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text',
          };
          
          return {
            ...state,
            chatbot: {
              ...state.chatbot,
              messages: [...state.chatbot.messages, newMessage, botResponse],
              lastActive: new Date(),
            },
          };
        }),
        
        addBotResponse: (response) => set((state) => {
          const newMessage: ChatMessage = {
            id: uuidv4(),
            content: response,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text',
          };
          
          return {
            ...state,
            chatbot: {
              ...state.chatbot,
              messages: [...state.chatbot.messages, newMessage],
              lastActive: new Date(),
            },
          };
        }),

        // UI operations
        setCurrentPage: (page) => set((state) => ({
          ...state,
          currentPage: page,
        })),
        
        setSearchTerm: (term) => set((state) => ({
          ...state,
          searchTerm: term,
        })),
        
        setFilterStatus: (status) => set((state) => ({
          ...state,
          filters: { ...state.filters, status },
        })),
        
        setFilterPriority: (priority) => set((state) => ({
          ...state,
          filters: { ...state.filters, priority },
        })),

        // Data operations
        loadTodos: async () => {
          set({ loading: true });
          try {
            // Load todos from backend API
            const { getTodos } = await import('../services/todoApi');
            const result = await getTodos(1, 100); // Get first 100 todos

            // Update state with fetched todos
            set((state) => ({
              ...state,
              todos: result.items,
              loading: false,
              error: null,
            }));
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },

        saveTodos: async () => {
          set({ loading: true });
          try {
            // This would save to localStorage or API in a real implementation
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },

        loadPreferences: async () => {
          set({ loading: true });
          try {
            // This would load from localStorage or API in a real implementation
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },

        savePreferences: async () => {
          set({ loading: true });
          try {
            // This would save to localStorage or API in a real implementation
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },

        // Chat history persistence
        saveChatHistory: async () => {
          set({ loading: true });
          try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },

        loadChatHistory: async () => {
          set({ loading: true });
          try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
          }
        },
      },
    })),
    {
      name: 'todo-app-storage', // unique name for localStorage
      partialize: (state) => ({
        todos: state.todos,
        preferences: state.preferences,
        chatbot: state.chatbot,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }), // only persist these fields
      merge: (persistedState, currentState) => {
        const mergedState = {
          ...currentState,
          ...(persistedState as Partial<AppState>),
        };
        return dateDeserializer(mergedState);
      }
    }
  )
);