// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { useAppStore } from '@/lib/store';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone?: string;
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
          setToken(storedToken);

          // If we don't have stored user details, try to reconstruct them from the token
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          } else {
            // Decode the token to get user ID
            try {
              const tokenParts = storedToken.split('.');
              if (tokenParts.length === 3) {
                const payload = tokenParts[1];
                const decodedPayload = atob(payload);
                const tokenPayload = JSON.parse(decodedPayload);
                const userId = tokenPayload.sub;

                // Create a minimal user object from the token
                const userObj = {
                  id: userId,
                  email: '', // Email is not available in the token
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                setUser(userObj);
              }
            } catch (e) {
              console.error('Error decoding stored JWT token:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);

        // If we don't have stored user details, try to reconstruct them from the token
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        } else {
          // Decode the token to get user ID
          try {
            const tokenParts = storedToken.split('.');
            if (tokenParts.length === 3) {
              const payload = tokenParts[1];
              const decodedPayload = atob(payload);
              const tokenPayload = JSON.parse(decodedPayload);
              const userId = tokenPayload.sub;

              // Create a minimal user object from the token
              const userObj = {
                id: userId,
                email: '', // Email is not available in the token
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setUser(userObj);
            }
          } catch (e) {
            console.error('Error decoding stored JWT token:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token } = response.data;

      // Store token
      localStorage.setItem('access_token', access_token);
      setToken(access_token);

      // Decode the JWT to get user ID
      let userId = '';
      try {
        const tokenParts = access_token.split('.');
        if (tokenParts.length === 3) {
          const payload = tokenParts[1];
          const decodedPayload = atob(payload);
          const tokenPayload = JSON.parse(decodedPayload);
          userId = tokenPayload.sub; // subject claim usually contains user ID
        } else {
          console.warn('Token does not have 3 parts, cannot decode:', tokenParts.length);
        }
      } catch (e) {
        console.error('Error decoding JWT token:', e);
        console.error('Access token that failed to decode:', access_token);
        // If we can't decode the token, we'll proceed with an empty ID
        userId = '';
      }

      // Create user object with the decoded ID
      const userObj = {
        id: userId,
        email,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);

      router.push('/todo-app');
    } catch (error: any) {
      // Check if error has response data
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed: Unknown error occurred');
      }
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });

      // After registration, typically you'd either auto-login or redirect to login
      // For this implementation, we'll redirect to login
      router.push('/login');
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Call the store's logout function to ensure consistent state
      await useAppStore.getState().actions.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Also update local state for immediate UI feedback
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Update the user in localStorage as well
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!(token && user),
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};