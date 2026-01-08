// Test for ErrorBoundary component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Mock component that throws an error
const BrokenComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  test('renders error message when child component throws error', () => {
    console.error = jest.fn(); // Suppress console error during test
    
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We apologize for the inconvenience/i)).toBeInTheDocument();
  });

  test('renders children when no error occurs', () => {
    const message = 'Normal content';
    
    render(
      <ErrorBoundary>
        <div>{message}</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});