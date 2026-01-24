# Research Findings: ChatKit Agent Integration

## Decision: Using Google Gemini with OpenAI Agents SDK

### Rationale:
Based on research, there are a few approaches to use Google Gemini with OpenAI Agents SDK:
1. Use the OpenAIChatCompletionsModel with a proxy that translates OpenAI API calls to Google Gemini API calls
2. Use Google's own agent framework instead of OpenAI Agents SDK
3. Use a multi-provider LLM abstraction layer like LangChain or LiteLLM

The best approach is to use LiteLLM, which provides a unified interface that supports both OpenAI and Google models, allowing us to keep the OpenAI Agents SDK while using Google Gemini.

### Alternatives considered:
- Building a custom proxy: More complex and error-prone
- Switching to Google's agent framework: Would require significant architectural changes
- Using LangChain: Possible but adds complexity for a simple agent integration

## Decision: Storing Chat History in PostgreSQL

### Rationale:
For storing chat history in PostgreSQL with SQLModel, we'll create a dedicated ChatHistory model with the required fields. This approach follows the existing patterns in the application and allows for efficient querying and management of chat history.

The model will include:
- id: UUID primary key
- user_id: UUID foreign key linking to the user
- user_query: TEXT field for the user's query
- agent_response: TEXT field for the agent's response
- task_performed: VARCHAR field describing any task performed
- timestamp: DATETIME field for when the interaction occurred

### Alternatives considered:
- Storing in a separate database: Adds complexity without clear benefits
- Using a document store: Overkill for structured chat history data
- Storing in Redis: Not persistent enough for long-term history

## Decision: Implementing Agent Tools for Todo Operations

### Rationale:
To enable the agent to perform todo operations, we'll create specialized tools that wrap the existing todo service functions. These tools will:
1. Use the same authentication and validation as the existing API endpoints
2. Operate through the existing service layer to maintain consistency
3. Be registered with the agent to enable task execution

The tools will include functions for:
- Creating new todo items
- Updating existing todo items
- Deleting todo items
- Toggling completion status
- Retrieving todo items

### Alternatives considered:
- Direct database access: Bypasses business logic and validation
- Separate service layer: Creates duplicate functionality
- Calling API endpoints from within the agent: Unnecessary overhead

## Decision: Handling Authentication Context in Agent Operations

### Rationale:
To maintain security and user isolation, the agent will operate within the authenticated user context. This will be achieved by:
1. Passing the user ID from the authenticated request to the agent context
2. Ensuring all agent operations are performed with the proper user context
3. Validating that the agent can only perform operations on behalf of the authenticated user

This approach maintains the existing security model while enabling the agent to perform authorized operations.

### Alternatives considered:
- Giving the agent its own authentication: Would bypass user-specific data access controls
- Stateless operations: Would not respect user permissions
- Separate authentication for agent: Adds unnecessary complexity

## Decision: Implementing Floating Widget vs Dedicated Page

### Rationale:
For the UI implementation, we'll create:
1. A dedicated chat page using the Next.js app router for full-featured interactions
2. A floating widget component that can be embedded in other pages for quick access

The floating widget will be implemented as a React component that can be imported and used across different pages. It will share the same underlying chat logic as the dedicated page but with a more compact UI.

### Alternatives considered:
- Single implementation approach: Would not meet the requirement for both interfaces
- Separate codebases: Would lead to code duplication and maintenance issues
- Iframe approach: Would complicate authentication and state management