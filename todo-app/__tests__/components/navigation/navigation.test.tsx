// Test for NavigationLinks component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavigationLinks } from '@/components/navigation/NavigationLinks';

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('NavigationLinks', () => {
  test('renders all navigation links', () => {
    render(<NavigationLinks />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('applies active class to current page', () => {
    render(<NavigationLinks />);
    
    // Since we're mocking the pathname to be '/', the Home link should be active
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveClass('bg-primary');
  });
});