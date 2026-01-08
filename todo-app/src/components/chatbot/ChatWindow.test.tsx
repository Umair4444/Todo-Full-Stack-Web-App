// Test file to verify chatbot functionality
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWindow } from '@/components/chatbot/ChatWindow';

describe('ChatWindow Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    render(<ChatWindow onClose={mockOnClose} />);
  });

  test('renders initial bot message', () => {
    expect(screen.getByText(/Hello!/i)).toBeInTheDocument();
  });

  test('allows user to type and send a message', () => {
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('displays typing indicator when bot is responding', async () => {
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Check for typing indicator after sending message
    expect(screen.getByLabelText('Assistant is typing')).toBeInTheDocument();
  });

  test('closes chat window when close button is clicked', () => {
    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});