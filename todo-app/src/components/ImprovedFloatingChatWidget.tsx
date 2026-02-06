'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bot, 
  User, 
  Send, 
  MessageCircle, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Sparkles, 
  Paperclip, 
  Loader2,
  Circle,
  Zap,
  Heart,
  Sparkle
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskId?: string;
  feedback?: 'positive' | 'negative';
}

export default function ImprovedFloatingChatWidget() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname(); // Get the current route
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't show the widget on the /chat page
  const shouldHideWidget = pathname === '/chat';

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

  if (!isAuthenticated || shouldHideWidget) {
    // Don't show the widget if the user is not authenticated or on the /chat page
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="w-80 h-96 flex flex-col shadow-2xl border-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-gray-800 dark:to-slate-900 rounded-2xl overflow-hidden backdrop-blur-xl"
            initial={{ scale: 0.8, opacity: 0, height: 0 }}
            animate={{ scale: 1, opacity: 1, height: 'auto' }}
            exit={{ scale: 0.8, opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-2xl overflow-hidden bg-transparent">
              <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-800 dark:text-gray-200">AI Assistant</span>
                  <div className="relative flex h-3 w-3">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></div>
                  </div>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto w-auto rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="h-[calc(100%-80px)] p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-4">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-full mb-4"
                        >
                          <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                        </motion.div>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          How can I help you today?
                        </motion.p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={`${index}-${message.timestamp.getTime()}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <Avatar className={`w-8 h-8 flex-shrink-0 ${message.role === 'user' ? 'order-2' : ''}`}>
                            {message.role === 'user' ? (
                              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border border-gray-200 dark:border-gray-700">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white border border-indigo-400/30">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div
                            className={`rounded-2xl p-4 max-w-[80%] text-sm relative group ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white ml-auto rounded-br-md shadow-md'
                                : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm rounded-bl-md shadow-sm'
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">{message.content}</div>

                            {/* Action buttons that appear on hover */}
                            {message.role === 'assistant' && (
                              <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md p-1 shadow-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(index, 'positive')}
                                  className={`h-7 w-7 p-0 rounded-full ${
                                    message.feedback === 'positive'
                                      ? 'text-green-500 bg-green-500/10'
                                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(index, 'negative')}
                                  className={`h-7 w-7 p-0 rounded-full ${
                                    message.feedback === 'negative'
                                      ? 'text-red-500 bg-red-500/10'
                                      : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                                  }`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyMessage(message.content)}
                                  className="h-7 w-7 p-0 rounded-full text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10"
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
                        className="flex items-start gap-3"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white border border-indigo-400/30">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl p-4 max-w-[80%] bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm rounded-bl-md text-sm">
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-800/50 dark:to-gray-800/50 backdrop-blur-sm">
                  <div className="relative flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      className="text-sm h-10 pl-10 pr-10 rounded-full border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                      size={1}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 p-0 shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white border-4 border-white dark:border-gray-800 hover:shadow-2xl transition-all duration-300"
            aria-label="Open chat"
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7" />
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkle className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}