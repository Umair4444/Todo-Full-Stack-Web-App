// Test for Notification component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notification } from '@/components/ui/Notification';

describe('Notification', () => {
  test('renders notification toaster', () => {
    render(<Notification />);
    
    // The Toaster component from Sonner should render without errors
    // We can't easily test the actual toast functionality without triggering toasts
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});