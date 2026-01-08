// Language switcher component
'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define available languages
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'اردو' }, // Urdu
];

// Create context for language management
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language preference in localStorage
    const savedLanguage = localStorage.getItem('todo-app-language');
    if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update the language in the UI
    document.documentElement.lang = currentLanguage;

    // Save the language preference
    localStorage.setItem('todo-app-language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (langCode: string) => {
    if (LANGUAGES.some(lang => lang.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLanguage === lang.code ? 'font-bold' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}