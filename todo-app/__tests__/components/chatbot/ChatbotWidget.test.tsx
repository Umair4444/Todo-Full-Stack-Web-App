// Test for ChatbotWidget component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';

describe('ChatbotWidget', () => {
  test('renders chatbot widget button', () => {
    render(<ChatbotWidget />);
    
    const chatbotButton = screen.getByRole('button', { name: /Open chatbot/i });
    expect(chatbotButton).toBeInTheDocument();
  });

  test('opens chat window when clicked', () => {
    render(<ChatbotWidget />);
    
    const chatbotButton = screen.getByRole('button', { name: /Open chatbot/i });
    fireEvent.click(chatbotButton);
    
    // The chat window should appear after clicking
    expect(screen.getByText('Todo Assistant')).toBeInTheDocument();
  });
});