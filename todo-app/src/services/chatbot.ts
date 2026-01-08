// Simulated chatbot responses service
import { ChatMessage } from '@/lib/types';

// Predefined responses for common questions
const PREDEFINED_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm your TodoApp assistant. How can I help you today?",
    "Hi there! I'm here to assist you with your todo management. What do you need help with?",
    "Greetings! I'm your TodoApp helper. Feel free to ask me anything about the app."
  ],
  todo: [
    "You can add a new todo by clicking the 'Add New Task' section on the Todo App page.",
    "To manage your todos, visit the Todo App page where you can add, edit, complete, or delete tasks.",
    "You can filter your todos by status (active/completed) and priority (low/medium/high) on the Todo App page."
  ],
  help: [
    "I'm here to help! You can ask me about adding todos, filtering tasks, or changing settings.",
    "Need assistance? Ask me about any feature in the app, and I'll guide you through it.",
    "For help with specific features, just ask me about them directly!"
  ],
  feature: [
    "Our app includes todo management, dark/light mode, multilingual support, and a helpful chatbot.",
    "Key features include task management with priorities, filtering options, and a responsive design.",
    "You can customize your experience with theme toggling and language selection in the navbar."
  ],
  default: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I'm here to help with your todo management. Could you be more specific about what you need?",
    "I'm a simulated assistant. For complex issues, please contact our support team.",
    "Thanks for reaching out! Is there something specific about the todo app you'd like to know?"
  ]
};

// Keywords to identify the intent of user messages
const KEYWORDS: Record<string, string[]> = {
  greeting: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon'],
  todo: ['todo', 'task', 'add', 'create', 'delete', 'complete', 'edit', 'manage'],
  help: ['help', 'assist', 'support', 'guide', 'how do', 'how to', 'what is'],
  feature: ['feature', 'function', 'capability', 'what can', 'what does', 'options']
};

export function getChatbotResponse(userMessage: string): ChatMessage {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Identify the intent based on keywords
  let intent: string | null = null;
  
  for (const [key, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      intent = key;
      break;
    }
  }
  
  // Get a random response based on the identified intent
  const responses = PREDEFINED_RESPONSES[intent || 'default'];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Create the chat message
  const botMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    content: randomResponse,
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  };
  
  return botMessage;
}

// Function to get initial greeting message
export function getInitialGreeting(): ChatMessage {
  const responses = PREDEFINED_RESPONSES['greeting'];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: `greeting-${Date.now()}`,
    content: randomResponse,
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  };
}