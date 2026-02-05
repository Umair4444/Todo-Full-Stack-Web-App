// src/components/FloatingChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, MessageCircle, X, ThumbsUp, ThumbsDown, Copy, Sparkles, Paperclip, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskId?: string;
  feedback?: 'positive' | 'negative';
}

export default function FloatingChatWidget() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isAuthenticated) return;

    // Add user message to the chat
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Call the chat API
      const response = await chatService.sendMessage(inputValue);

      // Add assistant message to the chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        taskId: response.task_performed,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show success toast if a task was performed
      if (response.task_performed && response.task_performed !== 'GENERAL_QUERY') {
        toast.success(`Task completed: ${response.task_performed}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');

      // Add error message to the chat
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFeedback = (messageIndex: number, feedback: 'positive' | 'negative') => {
    setMessages(prev => {
      const updatedMessages = [...prev];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        feedback
      };
      return updatedMessages;
    });
    
    toast.success(feedback === 'positive' ? 'Thanks for your positive feedback!' : 'Thanks for your feedback, I\'ll improve!');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  if (!isAuthenticated) {
    // Don't show the widget if the user is not authenticated
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="w-80 h-96 flex flex-col shadow-xl border-0 bg-gradient-to-b from-background to-muted rounded-xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, height: 0 }}
            animate={{ scale: 1, opacity: 1, height: 'auto' }}
            exit={{ scale: 0.8, opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-xl">
              <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <h3 className="font-semibold flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  AI Assistant
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto w-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="h-[calc(100%-80px)] p-3">
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-4">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-full mb-4">
                          <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          How can I help you today?
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={`${index}-${message.timestamp.getTime()}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-2 ${
                            message.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <Avatar className={`w-7 h-7 ${message.role === 'user' ? '' : 'bg-primary'}`}>
                            {message.role === 'user' ? (
                              <AvatarFallback className="text-xs bg-secondary">
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                <Bot className="w-3 h-3" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div
                            className={`rounded-xl p-3 max-w-[75%] text-sm relative group ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-card border'
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">{message.content}</div>

                            {/* Action buttons that appear on hover */}
                            {message.role === 'assistant' && (
                              <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(index, 'positive')}
                                  className={`h-7 w-7 p-0 ${
                                    message.feedback === 'positive'
                                      ? 'text-green-500'
                                      : 'text-muted-foreground hover:text-green-500'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(index, 'negative')}
                                  className={`h-7 w-7 p-0 ${
                                    message.feedback === 'negative'
                                      ? 'text-red-500'
                                      : 'text-muted-foreground hover:text-red-500'
                                  }`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyMessage(message.content)}
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-2"
                      >
                        <Avatar className="w-7 h-7 bg-primary">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            <Bot className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-xl p-3 max-w-[75%] bg-card border text-sm">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="p-3 border-t bg-background rounded-b-lg">
                  <div className="relative flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </Button>
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      className="text-sm h-9 pl-8 pr-9 rounded-full"
                      size={1}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 p-0 shadow-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}