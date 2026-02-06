"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  User,
  Send,
  Plus,
  Trash2,
  Search,
  MoreVertical,
  Copy,
  Sparkles,
  Menu,
  X,
  ThumbsUp,
  ThumbsDown,
  Edit,
  List,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  Paperclip,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskId?: string;
  feedback?: "positive" | "negative";
}

interface ChatHistoryItem {
  id: string;
  user_query: string;
  agent_response: string;
  task_performed: string;
  timestamp: string;
}

interface ChatGPTStyleChatInterfaceProps {
  sessionId?: string;
  userId?: string;
  className?: string;
  theme?: "light" | "dark";
}

const ChatGPTStyleChatInterface: React.FC<ChatGPTStyleChatInterfaceProps> = ({
  sessionId,
  userId,
  className = "",
  theme = "light",
}) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [filteredHistories, setFilteredHistories] = useState<ChatHistoryItem[]>(
    [],
  );
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByDate, setFilterByDate] = useState<"all" | "today" | "week" | "month">("all");
  const [filterByTask, setFilterByTask] = useState<"all" | "todo_operations" | "general">("all");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat histories on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistories();
    }
  }, [isAuthenticated]);

  // Filter chat histories based on search and filters
  useEffect(() => {
    let filtered = [...chatHistories];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (history) =>
          history.user_query
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          history.agent_response
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply date filter
    if (filterByDate !== "all") {
      const now = new Date();
      filtered = filtered.filter((history) => {
        const historyDate = new Date(history.timestamp);

        switch (filterByDate) {
          case "today":
            return historyDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return historyDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return historyDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply task filter
    if (filterByTask !== "all") {
      if (filterByTask === "todo_operations") {
        filtered = filtered.filter(
          (history) =>
            history.task_performed &&
            history.task_performed !== "GENERAL_QUERY",
        );
      } else if (filterByTask === "general") {
        filtered = filtered.filter(
          (history) =>
            !history.task_performed ||
            history.task_performed === "GENERAL_QUERY",
        );
      }
    }

    setFilteredHistories(filtered);
  }, [chatHistories, searchQuery, filterByDate, filterByTask]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistories = async () => {
    try {
      const response = await chatService.getChatHistory(50, 0);
      setChatHistories(response.history);
      setFilteredHistories(response.history);
    } catch (error) {
      console.error("Error loading chat histories:", error);
      toast.error("Failed to load chat history.");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedHistory(null);
    toast.info("Started a new chat");
  };

  const handleDeleteChat = async (historyId: string) => {
    try {
      await chatService.deleteChatHistory(historyId);
      setChatHistories((prev) => prev.filter((h) => h.id !== historyId));
      if (selectedHistory === historyId) {
        setMessages([]);
        setSelectedHistory(null);
      }
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat.");
    }
  };

  const handleSelectHistory = async (historyId: string) => {
    try {
      const history = await chatService.getSpecificChatHistory(historyId);
      setSelectedHistory(historyId);

      // Format the selected history as messages
      const formattedMessages: Message[] = [
        {
          role: "user",
          content: history.user_query,
          timestamp: new Date(history.timestamp),
        },
        {
          role: "assistant",
          content: history.agent_response,
          timestamp: new Date(history.timestamp),
          taskId: history.task_performed,
        },
      ];

      setMessages(formattedMessages);

      // Close mobile sidebar after selection
      setIsMobileSidebarOpen(false);
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history.");
    }
  };

  // Handle Enter key press in input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Early return if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Please sign in to access the chat interface.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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

      // Refresh chat history list
      loadChatHistories();
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
      // Scroll to bottom after message is sent
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleFeedback = (messageIndex: number, feedback: "positive" | "negative") => {
    setMessages(prev => {
      const updatedMessages = [...prev];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        feedback
      };
      return updatedMessages;
    });

    toast.success(feedback === "positive" ? "Thanks for your positive feedback!" : "Thanks for your feedback, I'll improve!");
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className={cn("flex flex-1 bg-background text-foreground h-[85vh] max-h-[85vh]", className)}>
      {/* Sidebar - Chat History */}
      <div className="relative flex flex-1 min-h-0">
        <AnimatePresence>
          {(isSidebarOpen || isMobileSidebarOpen) && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-64 flex flex-col border-r bg-gradient-to-b from-background to-muted h-full z-10 md:z-0 absolute md:relative inset-y-0"
            >
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Chat History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-3 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="flex items-center gap-1 w-full justify-start mb-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                New chat
              </Button>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter Controls */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="truncate max-w-[60px]">
                          {filterByDate.charAt(0).toUpperCase() +
                            filterByDate.slice(1)}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterByDate("all")}>
                        All Time
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterByDate("today")}
                      >
                        Today
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterByDate("week")}>
                        This Week
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterByDate("month")}
                      >
                        This Month
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Filter className="w-4 h-4" />
                        <span className="truncate max-w-[60px]">
                          {filterByTask.charAt(0).toUpperCase() +
                            filterByTask.slice(1)}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterByTask("all")}>
                        All Types
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterByTask("todo_operations")}
                      >
                        Todo Operations
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterByTask("general")}
                      >
                        General Queries
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Scrollable container for history items */}
            <div className="flex-1 overflow-y-auto">
              <ScrollArea className="h-full w-full p-2">
                <div className="space-y-1">
                  {filteredHistories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No chat history found</p>
                      <p className="text-sm mt-1">Start a new conversation</p>
                    </div>
                  ) : (
                    filteredHistories.map((history) => (
                      <motion.div
                        key={history.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                          selectedHistory === history.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => handleSelectHistory(history.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {history.user_query.substring(0, 40)}
                              {history.user_query.length > 40 ? "..." : ""}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs opacity-70">
                                {formatDate(history.timestamp)}
                              </span>
                              {history.task_performed &&
                                history.task_performed !== "GENERAL_QUERY" && (
                                  <Badge
                                    variant={
                                      selectedHistory === history.id
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {history.task_performed.replace("_", " ")}
                                  </Badge>
                                )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`ml-2 h-6 w-6 p-0 ${
                                  selectedHistory === history.id
                                    ? "text-primary-foreground hover:text-primary-foreground"
                                    : ""
                                }`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyMessage(history.user_query);
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Query
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(history.id);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

       
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 md:ml-0 transition-all duration-300">
        {/* Top Bar */}
        <div className="p-3 border-b flex items-center bg-background sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
          <h1 className="text-xl font-bold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Assistant
          </h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/30 min-h-0">
          <div className="max-w-3xl mx-auto w-full py-6 px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center flex-grow">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 p-2 md:p-6 rounded-2xl mb-3 md:mb-6"
                >
                  <div className="bg-primary/10 p-1 md:p-3 rounded-full inline-block">
                    <Bot className="h-6 md:h-12 w-6 md:w-12 text-primary" />
                  </div>
                </motion.div>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl font-bold mb-3"
                >
                  How can I help you today?
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground max-w-sm mb-3 md:mb-6 text-xs md:text-sm"
                >
                  Ask me anything or request help with your todos. I can help
                  you create, update, or manage your tasks.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md"
                >
                  <Button
                    variant="outline"
                    onClick={() =>
                      setInputValue("What can you help me with?")
                    }
                    className="justify-start gap-2 h-auto py-3 text-sm"
                  >
                    <Bot className="w-4 h-4" />
                    <span>What can you help me with?</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputValue("Create a new todo for me")}
                    className="justify-start gap-2 h-auto py-3 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create a new todo</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputValue("How do I update a todo?")}
                    className="justify-start gap-2 h-auto py-3 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Update a todo</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputValue("Show me my recent todos")}
                    className="justify-start gap-2 h-auto py-3 text-sm"
                  >
                    <List className="w-4 h-4" />
                    <span>Show recent todos</span>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6 pb-32">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${index}-${message.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="w-9 h-9 flex-shrink-0 bg-primary mt-0.5">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 relative group ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-card border rounded-bl-none shadow-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {message.taskId &&
                            message.taskId !== "GENERAL_QUERY" && (
                              <Badge
                                variant={
                                  message.role === "user"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs ml-2"
                              >
                                {message.taskId.replace("_", " ")}
                              </Badge>
                            )}
                        </div>

                        {/* Action buttons that appear on hover */}
                        {message.role === "assistant" && (
                          <div className="absolute -bottom-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(index, "positive")}
                              className={`h-8 w-8 p-0 ${
                                message.feedback === "positive"
                                  ? "text-green-500"
                                  : "text-muted-foreground hover:text-green-500"
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(index, "negative")}
                              className={`h-8 w-8 p-0 ${
                                message.feedback === "negative"
                                  ? "text-red-500"
                                  : "text-muted-foreground hover:text-red-500"
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyMessage(message.content)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <Avatar className="w-9 h-9 flex-shrink-0 mt-0.5">
                          <AvatarFallback className="bg-secondary">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-9 h-9 flex-shrink-0 bg-primary mt-0.5">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-2xl p-4 bg-card border rounded-bl-none shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Assistant..."
                disabled={isLoading}
                className="py-6 pl-12 pr-16 rounded-full"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 h-9 w-9 rounded-full p-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI Assistant can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
    {/* Closing div for the wrapper */}
    </div>
  );
};

export { ChatGPTStyleChatInterface };