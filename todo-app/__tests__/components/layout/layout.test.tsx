// Test for MainLayout component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MainLayout } from '@/components/layout/MainLayout';

describe('MainLayout', () => {
  test('renders layout with all components', () => {
    render(
      <MainLayout>
        <div>Test Child</div>
      </MainLayout>
    );
    
    // The layout should render the child content
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    
    // The layout should include the floating navbar
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // The layout should include the footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // The layout should include the chatbot widget
    expect(screen.getByLabelText(/Open chatbot/i)).toBeInTheDocument();
  });
});