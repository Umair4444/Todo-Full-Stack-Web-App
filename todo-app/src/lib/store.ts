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

        // Authentication operations
        login: async (email, password) => {
          set({ loading: true });
          try {
            // Call the backend login API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                username: email,
                password: password,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            const { access_token } = data;

            // Get user profile after successful login
            const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${access_token}`,
              },
            });

            if (profileResponse.ok) {
              const userProfile = await profileResponse.json();
              set({
                user: {
                  ...userProfile,
                  createdAt: new Date(userProfile.created_at),
                  updatedAt: new Date(userProfile.updated_at),
                },
                token: access_token,
                isAuthenticated: true,
                loading: false,
              });

              // Store in localStorage for persistence
              localStorage.setItem('authToken', access_token);
              localStorage.setItem('user', JSON.stringify(userProfile));
            }
          } catch (error) {
            set({ loading: false, error: (error as Error).message });
            throw error; // Re-throw so calling code can handle it
          }
        },

        register: async (email, password, name) => {
          set({ loading: true });
          try {
            // Call the backend register API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
                name: name || email.split('@')[0], // Use part of email as name if not provided
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Registration failed');
            }

            const userData = await response.json();

            // Automatically log in after successful registration
            await get().actions.login(email, password);
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
            // In a real implementation, you would call the sync service
            // const { todos } = await SyncService.fullSync();
            // For now, we'll just simulate the sync
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            // Update the state with synced todos
            // set(state => ({
            //   ...state,
            //   todos: todos,
            //   loading: false
            // }));

            set(state => ({
              ...state,
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