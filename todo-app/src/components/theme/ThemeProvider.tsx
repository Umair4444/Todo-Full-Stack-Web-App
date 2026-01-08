// Theme provider component to manage light/dark mode
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'todo-app-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps & { attribute?: string; enableSystem?: boolean; disableTransitionOnChange?: boolean }) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined'
      ? (localStorage.getItem(storageKey) as Theme) || defaultTheme
      : defaultTheme)
  );

  useEffect(() => {
    const root = window.document.documentElement;

    let themeToApply = theme;
    if (theme === 'system' && enableSystem) {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.remove('light', 'dark');
    if (attribute === 'class') {
      root.classList.add(themeToApply);
    } else {
      root.setAttribute(attribute, themeToApply);
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};