// Test for ChatWindow component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWindow } from '@/components/chatbot/ChatWindow';

describe('ChatWindow', () => {
  test('renders chat window with header and input', () => {
    const mockOnClose = jest.fn();
    render(<ChatWindow onClose={mockOnClose} />);
    
    expect(screen.getByText('Todo Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close chat/i })).toBeInTheDocument();
  });

  test('allows user to type and send messages', () => {
    const mockOnClose = jest.fn();
    render(<ChatWindow onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /Send/i });
    
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);
    
    expect(input).toHaveValue('');
  });
});