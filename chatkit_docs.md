# OpenAI ChatKit Documentation

ChatKit is OpenAI's batteries-included framework for building high-quality, AI-powered chat experiences with deep UI customization and built-in response streaming. It provides both frontend components and backend infrastructure to create embeddable chat interfaces in your applications.

## Overview

ChatKit consists of two main components:
1. **Frontend Components** - React/web components for the chat UI
2. **Backend Framework** - Python/JavaScript server-side infrastructure

## Key Features

- Batteries-included framework for AI-powered chat experiences
- Deep UI customization capabilities
- Built-in response streaming
- Frontend components (chat bubbles, input fields, rich media widgets)
- Backend server infrastructure
- Support for custom agents and models
- Thread management and persistence
- File attachment support

## JavaScript/React Version

### Installation

```bash
npm install @openai/chatkit-react
```

### Basic Usage

```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export function MyChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // implement session refresh
        }

        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[320px]" />;
}
```

### Advanced Configuration

```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function MyChat() {
  const { control, sendUserMessage, focusComposer, setThreadId } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // Refresh expired token
          const res = await fetch('/api/chatkit/refresh', {
            method: 'POST',
            body: JSON.stringify({ token: existing }),
            headers: { 'Content-Type': 'application/json' },
          });
          const { client_secret } = await res.json();
          return client_secret;
        }

        // Create new session
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
    theme: 'dark',  // or 'light'
    locale: 'en',
    onError: ({ error }) => {
      console.error('ChatKit error:', error);
    },
    onThreadChange: ({ threadId }) => {
      localStorage.setItem('lastThreadId', threadId || '');
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[400px]" />;
}
```

### Custom API Backend Configuration

```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function ChatWithCustomBackend() {
  const { control } = useChatKit({
    api: {
      url: '/api/chat',
      domainKey: 'your-domain-key-from-openai',
      fetch: async (input, init) => {
        // Add custom headers or authentication
        const headers = {
          ...init?.headers,
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Custom-Header': 'custom-value',
        };

        return fetch(input, {
          ...init,
          headers,
          credentials: 'include',
        });
      },
      uploadStrategy: {
        type: 'two_phase',
      },
    },
    composer: {
      attachments: {
        enabled: true,
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[400px]" />;
}
```

### Web Component Methods

ChatKit also provides web component methods for imperative control:

```ts
const chatkit = document.getElementById('my-chat') as OpenAIChatKit;

await chatkit.focusComposer();
await chatkit.setThreadId(null); // new chat
await chatkit.setThreadId('thread_123');
await chatkit.sendUserMessage({ text: 'Hello there!' });
await chatkit.setComposerValue({ text: 'Draft message' });
await chatkit.fetchUpdates();
await chatkit.sendCustomAction({ type: 'refresh-dashboard', payload: { page: 'settings' } });
```

## Python Version

### Installation

```bash
pip install openai-chatkit
```

### Creating a Custom Server

```python
from chatkit.server import ChatKitServer
from chatkit.store import Store
from chatkit.types import ThreadMetadata, UserMessageItem, ThreadStreamEvent, AssistantMessageItem, AssistantMessageContent, ThreadItemDoneEvent
from collections.abc import AsyncIterator
from datetime import datetime

class MyChatKitServer(ChatKitServer[dict]):
    """Custom ChatKit server with context type as dict"""

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict,
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Generate assistant response for user message"""
        # Generate unique ID for the message
        msg_id = self.store.generate_item_id("message", thread, context)

        # Yield a complete assistant message
        yield ThreadItemDoneEvent(
            item=AssistantMessageItem(
                id=msg_id,
                thread_id=thread.id,
                created_at=datetime.now(),
                content=[AssistantMessageContent(text="Hello! How can I help you today?")],
            ),
        )

# Create server instance with a store implementation
server = MyChatKitServer(store=my_store)
```

### FastAPI Integration

```python
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse

from chatkit.server import ChatKitServer, StreamingResult

app = FastAPI()
store = MyPostgresStore(conn_info)
server = MyChatKitServer(store)


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    # Build a per-request context from the incoming HTTP request.
    context = MyRequestContext(user_id="abc123")

    # Let ChatKit handle the request and return either a streaming or JSON result.
    result = await server.process(await request.body(), context)
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
```

### Integrating with OpenAI Agents

```python
from chatkit.server import ChatKitServer, ThreadMetadata, UserMessageItem, ThreadStreamEvent
from chatkit.store import InMemoryStore
from chatkit.agents import Agent, AgentContext, Runner
from typing import AsyncIterator

# Define an agent with instructions and model
assistant = Agent(
    name="helpful_assistant",
    instructions="You are a helpful AI assistant. Provide clear, concise answers.",
    model="gpt-4o-mini",
)

class AgentChatKitServer(ChatKitServer[dict]):
    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict,
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Stream responses from OpenAI agent"""

        # Load recent thread history
        items_page = await self.store.load_thread_items(
            thread.id, after=None, limit=20, order="asc", context=context
        )

        # Convert ChatKit items to agent input format
        input_items = await simple_to_agent_input(items_page.data)

        # Create agent context for streaming operations
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context
        )

        # Run agent and stream response as ChatKit events
        result = Runner.run_streamed(assistant, input_items, context=agent_context)

        async for event in stream_agent_response(agent_context, result):
            yield event

# Usage with FastAPI
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, Response
from chatkit.server import StreamingResult

app = FastAPI()
server = AgentChatKitServer(store=InMemoryStore())

@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    """Single endpoint handling all ChatKit operations"""
    result = await server.process(await request.body(), context={})

    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
```

## Architecture

ChatKit follows a client-server architecture:

1. **Frontend** - React components or web components that handle the UI
2. **Backend** - Server implementation that processes requests and generates responses
3. **Store** - Persistence layer for threads, messages, and other data
4. **Agents** - AI models that generate responses to user messages

## Key Concepts

- **Threads** - Conversational contexts that group related messages
- **Messages** - Individual units of conversation (user or assistant)
- **Sessions** - Authentication and connection management
- **Stores** - Data persistence mechanisms (in-memory, PostgreSQL, etc.)
- **Agents** - AI models that process user input and generate responses

## Best Practices

1. Implement proper session management and token refresh
2. Use appropriate error handling and user feedback
3. Choose the right store implementation for your scale
4. Implement rate limiting and security measures
5. Customize the UI to match your application's design
6. Handle thread persistence and retrieval efficiently

## Use Cases

- Customer support chatbots
- AI assistants embedded in applications
- Educational platforms with AI tutors
- E-commerce chat interfaces
- Internal company tools with AI assistance