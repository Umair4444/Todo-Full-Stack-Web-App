// Chat window component
'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { Send, X, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuickReply } from './QuickReply';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage if available
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatbotMessages');
      if (savedMessages) {
        try {
          return JSON.parse(savedMessages, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
          });
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }
    }

    // Default initial message
    return [
      {
        id: '1',
        text: 'Hello! I\'m your TodoApp assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const quickReplies = [
    "Show my tasks",
    "Add new task",
    "Edit a task",
    "Delete a task"
  ];

  const handleSend = (messageText?: string | MouseEvent<HTMLButtonElement>) => {
    // Handle the case where handleSend is called from an event handler
    let textToSend = inputValue;

    if (typeof messageText === 'string') {
      textToSend = messageText;
    } else if (messageText !== undefined) {
      // If messageText is an event object, we'll use the inputValue
      // This handles the case where the function is called as an event handler
    }

    if (textToSend.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse = '';

      // Generate context-aware responses
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes('hello') || lowerText.includes('hi')) {
        botResponse = 'Hello there! How can I assist you with your tasks today?';
      } else if (lowerText.includes('task') || lowerText.includes('todo')) {
        botResponse = 'I can help you manage your tasks. You can add, edit, or delete tasks. What would you like to do?';
      } else if (lowerText.includes('add') || lowerText.includes('create')) {
        botResponse = 'Sure! Tell me the details of the task you want to add.';
      } else if (lowerText.includes('edit') || lowerText.includes('update')) {
        botResponse = 'Which task would you like to edit? You can describe it or refer to it by name.';
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        botResponse = 'Which task would you like to delete?';
      } else if (lowerText.includes('show') || lowerText.includes('list') || lowerText.includes('view')) {
        botResponse = 'I can help you view your tasks. Would you like to see all tasks or filter by priority?';
      } else {
        const botResponses = [
          'I understand. How else can I assist you?',
          'Thanks for letting me know. Is there anything else I can help with?',
          'Got it! Feel free to ask if you have more questions.',
          'I\'m here to help with your todo management. What else do you need?',
          'That\'s a great question! Let me know if you need help with your tasks.',
          'I can help you manage your tasks more efficiently. What would you like to do?',
          'For better productivity, try organizing your tasks by priority. Need help?',
          'You can add, edit, or delete tasks anytime. How can I assist you today?'
        ];
        botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowQuickReplies(true);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your TodoApp assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    localStorage.removeItem('chatbotMessages');
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="w-80 h-[500px] flex flex-col bg-background border rounded-xl shadow-2xl overflow-hidden glass-effect backdrop-blur-md border-primary/20 transition-all duration-300 hover:shadow-3xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-window-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-full" aria-hidden="true">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h3 id="chat-window-title" className="font-semibold text-foreground">Todo Assistant</h3>
          <div className="flex space-x-1 ml-2" aria-label="Online status">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse delay-75" aria-hidden="true"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse delay-150" aria-hidden="true"></div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            aria-label="Clear chat history"
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close chat"
            className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            role="listitem"
          >
            <div
              className={`max-w-full rounded-2xl p-4 relative ${
                message.sender === 'user'
                  ? 'bg-primary md:text-sm text-primary-foreground rounded-br-none'
                  : 'bg-card md:text-sm text-card-foreground rounded-bl-none border'
              }`}
              role="listitem"
              aria-label={`${message.sender === 'user' ? 'You said' : 'Assistant said'}: ${message.text}`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 pt-0.5" aria-hidden="true">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                <div>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 pt-0.5" aria-hidden="true">
                    <div className="p-1 bg-primary-foreground/10 rounded-full">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start" role="status" aria-live="polite">
            <div className="max-w-[80%] rounded-2xl p-4 bg-card text-card-foreground rounded-bl-none border">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-primary/10 rounded-full" aria-hidden="true">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex space-x-1" aria-label="Assistant is typing">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" aria-hidden="true"></div>
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75" aria-hidden="true"></div>
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150" aria-hidden="true"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQuickReplies && !isTyping && messages.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-start max-w-[80%]" role="group" aria-label="Suggested replies">
            {quickReplies.map((reply, index) => (
              <QuickReply
                key={index}
                text={reply}
                onClick={() => handleQuickReply(reply)}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-background p-3">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border-0 bg-muted focus-visible:ring-2 focus-visible:ring-primary/50"
            disabled={isTyping}
            aria-label="Type your message"
            role="textbox"
            aria-multiline="false"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="h-10 w-10 p-0 rounded-xl"
            aria-label="Send message"
          >
            {isTyping ? (
              <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2" aria-label="Assistant capabilities">
          Todo Assistant can help with your tasks
        </p>
      </div>
    </div>
  );
};