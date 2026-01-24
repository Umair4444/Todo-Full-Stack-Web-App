# Quickstart Guide: ChatKit Agent Integration

## Prerequisites

- Node.js 18+ with npm
- Python 3.11+
- uv package manager for Python
- Existing todo-app and todo-app-backend setup

## Environment Variables

Add these to your backend `.env` file:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-pro  # or whatever model you want to use
LITELLM_PROXY_URL=https://your-proxy-url-if-using-one.com  # Optional
```

Add this to your frontend `.env.local` file:

```env
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/api/chat  # Adjust if hosted elsewhere
```

## Setup Steps

### 1. Backend Setup

1. Install new Python dependencies:
   ```bash
   uv pip install openai-agents google-generativeai litellm
   ```

2. Update the database models by running migrations:
   ```bash
   # If using alembic for migrations
   alembic revision --autogenerate -m "Add chat history model"
   alembic upgrade head
   ```

3. Add the new API routes to the main application.

### 2. Frontend Setup

1. Install new dependencies:
   ```bash
   npm install @openai/chatkit-react
   ```

2. Create the chat components:
   - Dedicated chat page component
   - Floating widget component

3. Implement the API service to communicate with the backend chat endpoints.

### 3. Agent Configuration

1. Configure the OpenAI Agent with LiteLLM to use Google Gemini:
   ```python
   from agents import set_default_openai_api
   import os
   
   # Configure to use chat completions with LiteLLM proxy
   set_default_openai_api("chat_completions")
   
   # Set up LiteLLM to use Google Gemini
   os.environ["LITELLM_PROXY_URL"] = os.getenv("LITELLM_PROXY_URL", "")
   os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")
   ```

2. Create the agent tools for todo operations:
   - Create todo tool
   - Update todo tool
   - Delete todo tool
   - Toggle completion tool

### 4. Authentication Integration

1. Ensure JWT tokens are properly passed from frontend to backend for chat endpoints.
2. Verify that the agent operates within the authenticated user context.

## Running the Application

1. Start the backend:
   ```bash
   cd todo-app-backend
   uvicorn src.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd todo-app
   npm run dev
   ```

3. Access the chat functionality:
   - Via dedicated page: `http://localhost:3000/chat`
   - Via floating widget: Available on all pages after login

## Testing

1. Run backend tests:
   ```bash
   pytest
   ```

2. Run frontend tests:
   ```bash
   npm run test
   ```

3. Test the chat functionality manually by:
   - Logging in to the application
   - Navigating to the chat page or using the floating widget
   - Asking the agent to perform todo operations
   - Verifying that operations are correctly recorded in the database