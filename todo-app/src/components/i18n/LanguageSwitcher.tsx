// Language switcher component
'use client';

import React from 'react';
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

export function LanguageSwitcher() {
  // In a real implementation, this would use next-i18next or similar
  // For now, we'll simulate the language switching
  
  const currentLanguage = 'en'; // This would come from the i18n context
  
  const handleLanguageChange = (langCode: string) => {
    // In a real implementation, this would call i18n.changeLanguage(langCode)
    console.log(`Changing language to: ${langCode}`);
  };

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
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'font-bold' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}