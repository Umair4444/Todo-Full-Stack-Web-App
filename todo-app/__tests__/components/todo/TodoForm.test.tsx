// Test for TodoForm component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '@/components/todo/TodoForm';

describe('TodoForm', () => {
  test('renders form elements correctly', () => {
    render(<TodoForm />);
    
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add details about this task...')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Mark as completed')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  test('allows user to input title and description', () => {
    render(<TodoForm />);
    
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');
    
    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    expect(titleInput).toHaveValue('Test Todo');
    expect(descriptionInput).toHaveValue('Test Description');
  });
});