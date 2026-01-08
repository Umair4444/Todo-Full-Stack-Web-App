// Test for TodoList component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TodoList } from '@/components/todo/TodoList';

// Mock the Zustand store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(() => ({
    todos: [
      {
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
      }
    ],
    filters: { status: 'all', priority: 'all' },
    searchTerm: '',
    actions: {
      setFilterStatus: jest.fn(),
      setFilterPriority: jest.fn(),
      setSearchTerm: jest.fn(),
    }
  }))
}));

describe('TodoList', () => {
  test('renders todo items', () => {
    render(<TodoList />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('displays search input and filter controls', () => {
    render(<TodoList />);
    
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });
});