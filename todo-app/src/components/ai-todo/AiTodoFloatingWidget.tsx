"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Send,
  X,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Paperclip,
  Loader2,
  Clock,
  CheckCheck,
  RotateCcw,
  Volume2,
  Brain,
  MessageSquare,
  Mic,
  Plus,
  Edit,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskId?: string;
  feedback?: "positive" | "negative";
}

export default function AiTodoFloatingWidget() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname(); // Get the current route
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

  // Don't show the widget on the /chat page
  const shouldHideWidget = pathname === "/chat";

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Removed isLoading and isTyping dependencies to ensure it scrolls after each message

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node)
      ) {
        setIsAttachmentMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show quick replies when messages are empty
  useEffect(() => {
    if (messages.length === 0) {
      setShowQuickReplies(true);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    // Using a more reliable method to scroll to bottom with smooth behavior
    // For ScrollArea, we need to use a slightly different approach
    if (messagesEndRef.current) {
      // Use a slight delay to ensure DOM has updated before scrolling
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto", // Changed to 'auto' to prevent jarring scrolls with many messages
          block: "nearest",
        });
      }, 10);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isAuthenticated) return;

    // Hide quick replies when user sends a message
    setShowQuickReplies(false);

    // Add user message to the chat
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setIsLoading(true);

    try {
      // Show typing indicator
      setIsTyping(true);

      // Call the chat API
      const response = await chatService.sendMessage(inputValue);

      // Add assistant message to the chat
      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        taskId: response.task_performed,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Show success toast if a task was performed
      if (
        response.task_performed &&
        response.task_performed !== "GENERAL_QUERY"
      ) {
        toast.success(`Task completed: ${response.task_performed}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");

      // Add error message to the chat
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message with Ctrl/Cmd + Enter or just Enter without shift
    if (
      (e.key === "Enter" && !e.shiftKey) ||
      (e.ctrlKey && e.key === "Enter") ||
      (e.metaKey && e.key === "Enter")
    ) {
      e.preventDefault();
      handleSubmit(e as any);
    }

    // Close chat with Escape key
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    inputRef.current?.focus();
  };

  const handleFeedback = (
    messageIndex: number,
    feedback: "positive" | "negative",
  ) => {
    setMessages((prev) => {
      const updatedMessages = [...prev];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        feedback,
      };
      return updatedMessages;
    });

    toast.success(
      feedback === "positive"
        ? "Thanks for your positive feedback!"
        : "Thanks for your feedback, I'll improve!",
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  if (!isAuthenticated || shouldHideWidget) {
    // Don't show the widget if the user is not authenticated or on the /chat page
    return null;
  }

  return (
    // <div className="fixed z-50 flex items-center justify-center p-4">
    <div className="fixed z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen ? (
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-4 container max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[80vh] max-h-[800px] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-gray-800 dark:to-slate-900 rounded-2xl overflow-hidden backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 350,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-2xl overflow-hidden bg-transparent">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="relative">
                    <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">
                    AI Assistant
                  </span>
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMessages([]);
                      setShowQuickReplies(true);
                    }}
                    className="p-1.5 h-auto w-auto rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors"
                    title="Start new chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 h-auto w-auto rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors"
                    title="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <ScrollArea
                  className="flex-1 min-h-[100px] p-4"
                  style={{ maxHeight: "calc(80vh - 150px)" }}
                >
                  <div className="space-y-5">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-6">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-full mb-4"
                        >
                          <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                        </motion.div>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 px-2 text-center"
                        >
                          How can I help you today?
                        </motion.p>

                        {showQuickReplies && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-2"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm py-3 px-2"
                              onClick={() =>
                                handleQuickReply("What can you help me with?")
                              }
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              <span className="text-nowrap overflow-hidden text-ellipsis">What can you help with?</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm py-3 px-2"
                              onClick={() =>
                                handleQuickReply("Create a new todo for me")
                              }
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              <span className="text-nowrap overflow-hidden text-ellipsis">Create a todo</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm py-3 px-2"
                              onClick={() =>
                                handleQuickReply("How do I update a todo?")
                              }
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              <span className="text-nowrap overflow-hidden text-ellipsis">Update a todo</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm py-3 px-2"
                              onClick={() =>
                                handleQuickReply("Show me my recent todos")
                              }
                            >
                              <List className="w-3 h-3 mr-1" />
                              <span className="text-nowrap overflow-hidden text-ellipsis">View todos</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={`${index}-${message.timestamp.getTime()}`}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`flex items-start gap-3 ${
                            message.role === "user"
                              ? "flex-row-reverse justify-end"
                              : "justify-start"
                          }`}
                        >
                          <Avatar
                            className={`w-8 h-8 flex-shrink-0 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                          >
                            {message.role === "user" ? (
                              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border border-gray-200 dark:border-gray-700">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white border border-indigo-400/30">
                                <Brain className="w-4 h-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div
                            className={`rounded-2xl p-4 max-w-[80%] text-sm relative group ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-auto rounded-br-md shadow-lg"
                                : "bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm rounded-bl-md shadow-md"
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>

                            {/* Timestamp and status indicators */}
                            <div
                              className={`flex items-center gap-1.5 mt-1.5 text-xs ${
                                message.role === "user"
                                  ? "text-blue-200 justify-end"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              {/* Message status indicator for user messages */}
                              {message.role === "user" && (
                                <>
                                  {isLoading &&
                                  index === messages.length - 1 ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-blue-200" />
                                  ) : (
                                    <CheckCheck className="w-3 h-3 text-blue-200" />
                                  )}
                                </>
                              )}
                            </div>

                            {/* Action buttons that appear on hover */}
                            {message.role === "assistant" && (
                              <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/70 dark:border-gray-700/70 rounded-md p-1 shadow-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFeedback(index, "positive")
                                  }
                                  className={`h-7 w-7 p-0 rounded-full ${
                                    message.feedback === "positive"
                                      ? "text-green-500 bg-green-500/10"
                                      : "text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10"
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFeedback(index, "negative")
                                  }
                                  className={`h-7 w-7 p-0 rounded-full ${
                                    message.feedback === "negative"
                                      ? "text-red-500 bg-red-500/10"
                                      : "text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                  }`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyMessage(message.content)
                                  }
                                  className="h-7 w-7 p-0 rounded-full text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {}}
                                  className="h-7 w-7 p-0 rounded-full text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {}}
                                  className="h-7 w-7 p-0 rounded-full text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3 justify-start"
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0 mr-2">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white border border-indigo-400/30">
                            <Brain className="w-4 h-4" />
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
                    <div ref={messagesEndRef} className="flex-shrink-0" />
                  </div>
                </ScrollArea>
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-800/50 dark:to-gray-800/50 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1">
                    <div className="relative" ref={attachmentMenuRef}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setIsAttachmentMenuOpen(!isAttachmentMenuOpen)
                        }
                        disabled={false} // Always enabled regardless of input state
                        className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 rounded-full transition-all duration-200 z-20 cursor-pointer"
                      >
                        <Paperclip
                          className={`w-4 h-4 transition-transform duration-200 ${isAttachmentMenuOpen ? "rotate-45" : ""}`}
                        />
                      </Button>

                      {isAttachmentMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden"
                        >
                          <div className="py-1">
                            <button
                              type="button"
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700/70 transition-colors duration-150 cursor-pointer"
                              onClick={() => {
                                // Simulate file upload
                                setInputValue(
                                  (prev) => prev + " [Document attached]",
                                );
                                setIsAttachmentMenuOpen(false);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                className="mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Document
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700/70 transition-colors duration-150 cursor-pointer"
                              onClick={() => {
                                // Simulate image upload
                                setInputValue(
                                  (prev) => prev + " [Image attached]",
                                );
                                setIsAttachmentMenuOpen(false);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                className="mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Photo
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700/70 transition-colors duration-150 cursor-pointer"
                              onClick={() => {
                                // Simulate voice note
                                setInputValue(
                                  (prev) => prev + " [Voice note attached]",
                                );
                                setIsAttachmentMenuOpen(false);
                              }}
                            >
                              <Mic className="w-4 h-4 mr-3" />
                              Voice
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        messages.length > 0
                          ? "Type your message..."
                          : "Ask me anything..."
                      }
                      disabled={isLoading}
                      className="flex-grow text-sm h-10 pl-3 pr-3 rounded-full border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50 transition-all max-h-20 overflow-y-auto"
                      size={1}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      size="sm"
                      className={`h-10 w-10 rounded-full text-white shadow-lg transition-all duration-200 flex items-center justify-center ${
                        isLoading || !inputValue.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-95 shadow-indigo-500/30 hover:shadow-indigo-500/40"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center justify-center w-full h-full"
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
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
            className="fixed bottom-4 right-4 rounded-full w-16 h-16 p-0 shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white border-4 border-white dark:border-gray-800 hover:shadow-2xl transition-all duration-300 z-50 cursor-pointer"
            aria-label="Open chat"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="relative"
            >
              <MessageSquare className="w-7 h-7" />
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Brain className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
