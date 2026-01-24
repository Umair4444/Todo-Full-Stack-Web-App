# Qwen Agent Context: ChatKit Agent Integration

## Technology Stack
- OpenAI Agents SDK with OpenAIChatCompletionsModel
- Google Gemini model integration via LiteLLM
- @openai/chatkit-react for frontend UI components
- SQLModel for database operations
- FastAPI for backend API endpoints
- Next.js 16.0.10 for frontend implementation

## Key Implementation Points
- Use LiteLLM to enable Google Gemini with OpenAI Agents SDK
- Implement agent tools for todo operations that work through existing service layer
- Store chat history with user_query, agent_response, and task_performed fields
- Maintain user authentication context in all agent operations
- Create both dedicated page and floating widget UI implementations

## Environment Variables
- GEMINI_API_KEY: Google Gemini API key
- GEMINI_MODEL: Specific Gemini model to use
- NEXT_PUBLIC_CHAT_API_URL: Frontend URL for chat API

## Database Models
- ChatHistory: Stores conversation history with user, agent, and task data
- AgentSession: Tracks active agent sessions (if needed)
- TodoOperationLog: Logs specific todo operations performed by agent (if needed)

## API Endpoints
- POST /api/chat/session: Initiate new chat session
- POST /api/chat/session/{session_id}/message: Send message to session
- GET /api/chat/history: Retrieve chat history
- Various /api/chat/agent/todo/* endpoints for direct todo operations

## Security Considerations
- All agent operations must respect user authentication
- Agent database access must go through authenticated endpoints
- Chat history must be isolated by user