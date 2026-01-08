// Test for LanguageSwitcher component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

describe('LanguageSwitcher', () => {
  test('renders language switcher button', () => {
    render(<LanguageSwitcher />);
    
    const switcherButton = screen.getByRole('button', { name: /Select language/i });
    expect(switcherButton).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(<LanguageSwitcher />);
    
    const switcherButton = screen.getByRole('button', { name: /Select language/i });
    fireEvent.click(switcherButton);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('اردو')).toBeInTheDocument();
  });
});