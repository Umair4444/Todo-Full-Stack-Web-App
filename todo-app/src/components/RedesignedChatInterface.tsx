// src/components/RedesignedChatInterface.tsx
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
  Calendar,
  Filter,
  MoreVertical,
  Edit,
  List,
  Sparkles,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface ChatHistoryItem {
  id: string;
  user_query: string;
  agent_response: string;
  task_performed: string;
  timestamp: string;
}

interface RedesignedChatInterfaceProps {
  sessionId?: string;
  userId?: string;
  className?: string;
  theme?: "light" | "dark";
  height?: string;
  width?: string;
}

const RedesignedChatInterface: React.FC<RedesignedChatInterfaceProps> = ({
  sessionId,
  userId,
  className = "",
  theme = "light",
  height = "500px",
  width = "100%",
}) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [filteredHistories, setFilteredHistories] = useState<ChatHistoryItem[]>(
    [],
  );
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByDate, setFilterByDate] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [filterByTask, setFilterByTask] = useState<
    "all" | "todo_operations" | "general"
  >("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Close mobile history panel after selection
      setIsMobileHistoryOpen(false);
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history.");
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
    }
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
    <div
      className={cn(
        `${className} flex flex-col md:flex-row h-full w-full bg-background rounded-xl overflow-hidden border shadow-lg`,
        height && width ? `${height} ${width}` : "",
      )}
    >
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b bg-background flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Assistant
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileHistoryOpen(!isMobileHistoryOpen)}
        >
          {isMobileHistoryOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Left Panel - Chat History */}
      <AnimatePresence>
        {(isHistoryPanelOpen || isMobileHistoryOpen) && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full md:w-80 flex flex-col border-r bg-muted/20 h-full absolute md:relative z-10 md:z-0"
          >
            <div className="p-4 border-b flex-shrink-0 bg-background md:bg-transparent">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Chat History
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New</span>
                </Button>
              </div>

              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filters */}
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
            <div className="flex-1 overflow-hidden">
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedHistory === history.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent/50"
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

            {/* Close button for mobile */}
            <div className="p-3 border-t md:hidden">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsMobileHistoryOpen(false)}
              >
                Close History
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile history panel */}
      {isMobileHistoryOpen && isHistoryPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileHistoryOpen(false)}
        />
      )}

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Toggle button for history panel */}
        <div className="p-3 border-b flex-shrink-0 bg-background">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileHistoryOpen(!isMobileHistoryOpen);
                } else {
                  setIsHistoryPanelOpen(!isHistoryPanelOpen);
                }
              }}
              className="flex items-center gap-1"
            >
              {isHistoryPanelOpen && window.innerWidth >= 768
                ? "Hide History"
                : "Show History"}
            </Button>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold hidden md:block">
                <span className="text-primary">AI</span> Assistant
              </h2>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable container */}
        <div className="flex-1 overflow-hidden p-2">
          <ScrollArea className="h-full w-full p-2">
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl mb-6"
                  >
                    <div className="bg-primary/10 p-4 rounded-full inline-block">
                      <Bot className="h-12 w-12 text-primary" />
                    </div>
                  </motion.div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Welcome to the AI Assistant
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground max-w-md mb-8"
                  >
                    Ask me anything or request help with your todos. I can help
                    you create, update, or manage your tasks.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue("What can you help me with?")
                      }
                      className="justify-start gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      <span>What can you help me with?</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue("Create a new todo for me")}
                      className="justify-start gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create a new todo</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue("How do I update a todo?")}
                      className="justify-start gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Update a todo</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue("Show me my recent todos")}
                      className="justify-start gap-2"
                    >
                      <List className="w-4 h-4" />
                      <span>Show recent todos</span>
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-4 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className={`w-9 h-9 flex-shrink-0 ${message.role === "user" ? "" : "bg-primary"}`}
                      >
                        {message.role === "user" ? (
                          <AvatarFallback className="bg-secondary">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-2xl p-5 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-card border shadow-sm"
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
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-4"
                >
                  <Avatar className="w-9 h-9 flex-shrink-0 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl p-5 max-w-[80%] bg-card border shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RedesignedChatInterface;
