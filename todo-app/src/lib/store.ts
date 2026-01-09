import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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

export interface AppState {
  // Todo items state
  todos: TodoItem[];
  filteredTodos: TodoItem[];
  loading: boolean;
  error: string | null;

  // User preferences state
  preferences: UserPreferences;

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
        addTodo: (todo) => {
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

            // Create new todo with unique ID and timestamps
            const newTodo: TodoItem = {
              ...todo,
              title: cleanTitle,
              description: cleanDescription,
              id: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Update state with new todo
            set((state) => ({
              ...state,
              todos: [...state.todos, newTodo],
              error: null,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
            }));
          }
        },

        updateTodo: (id, updates) => {
          try {
            // Validate updates if they exist
            if (updates.title && updates.title.length > 100) {
              throw new Error('Todo title must be less than 100 characters');
            }

            if (updates.description && updates.description.length > 500) {
              throw new Error('Todo description must be less than 500 characters');
            }

            // Update the todo with the provided changes
            set((state) => ({
              ...state,
              todos: state.todos.map(todo =>
                todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
              ),
              error: null,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
            }));
          }
        },

        deleteTodo: (id) => {
          try {
            // Remove the todo with the specified ID
            set((state) => ({
              ...state,
              todos: state.todos.filter(todo => todo.id !== id),
              error: null,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
            }));
          }
        },

        toggleTodoCompletion: (id) => {
          try {
            // Toggle the completion status of the specified todo
            set((state) => ({
              ...state,
              todos: state.todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
              ),
              error: null,
            }));
          } catch (error) {
            // Handle error by updating error state
            set((state) => ({
              ...state,
              error: (error as Error).message,
            }));
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

        // Navigation operations
        updateNavVisibility: (isVisible) => set((state) => ({
          ...state,
          navState: { ...state.navState, isVisible },
        })),
        
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
            // This would load from localStorage or API in a real implementation
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 500));
            // For now, we'll just keep the existing todos
            set({ loading: false });
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
        chatbot: state.chatbot
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