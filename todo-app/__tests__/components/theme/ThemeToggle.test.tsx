// Test for ThemeToggle component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// Mock the useTheme hook
jest.mock('@/components/theme/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

describe('ThemeToggle', () => {
  test('renders theme toggle button', () => {
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });
});