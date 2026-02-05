# Tasks: ChatKit Agent Integration

## Feature Overview
Integrate OpenAI ChatKit UI with OpenAI Agents SDK using OpenAIChatCompletionsModel with Google Gemini models. Users must be logged in to use the chatbot, chat history is saved in the database, and the agent can perform todo tasks using function tools.

## Implementation Strategy
- MVP: Implement User Story 1 (Authenticated Chat Interface) with basic functionality
- Incremental delivery: Add chat history persistence and todo task execution in subsequent phases
- Each user story is designed to be independently testable

## Dependencies
- User Story 1 (P1) must be completed before User Story 2 (P2)
- User Story 2 (P2) must be completed before User Story 3 (P3)
- Foundational tasks must be completed before any user story tasks

## Parallel Execution Opportunities
- Backend API development can run in parallel with frontend UI development
- Database model creation can run in parallel with service layer implementation
- Authentication middleware can be developed in parallel with core chat functionality

---

## Phase 1: Setup

- [X] T001 Set up Python dependencies for OPENAI AGENTS SDK PYTHON with Google Gemini integration in todo-app-backend
- [X] T001a Install openai-agents and openai-agents[litellm] packages in todo-app-backend
- [X] T002 Install frontend dependencies for chat UI components in todo-app
- [X] T003 Add required environment variables for GEMINI_API_KEY and GEMINI_MODEL to both frontend and backend
- [X] T003a [P] Research and document OPENAI AGENTS SDK PYTHON using Context7 in todo-app-backend/docs/agents_sdk.md
- [X] T003b [P] Research and document OpenAI ChatKit using Context7 in todo-app-backend/docs/gemini_integration.md
- [X] T003c [P] Research and document LiteLLM configuration using Context7 in todo-app-backend/docs/litellm_config.md
- [X] T003d [P] Research and document SQLMODEL using Context7 in todo-app-backend/docs/litellm_config.md
- [X] T003e [P] Research and document fastapi using Context7 in todo-app-backend/docs/litellm_config.md

## Phase 2: Foundational

- [X] T004 Create ChatHistory model in todo-app-backend/src/models/chat_history_model.py
- [X] T005 [P] Create database migration for ChatHistory model in todo-app-backend/alembic/versions/
- [X] T006 [P] Create ChatHistory service in todo-app-backend/src/services/chat_history_service.py
- [X] T007 Create agent tools base structure in todo-app-backend/src/agents/tools_base.py
- [X] T007a Create documentation for agent tools architecture in todo-app-backend/docs/agent_tools.md
- [X] T008 Set up LiteLLM configuration to use Google Gemini with OpenAI Agents SDK in todo-app-backend/src/config/litellm_config.py
- [X] T009 Create authentication middleware to pass user context to agent in todo-app-backend/src/middleware/agent_auth_middleware.py

## Phase 3: User Story 1 - Authenticated Chat Interface (Priority: P1)

### Story Goal
Authenticated users can access the ChatKit interface to interact with the OpenAI agent. The user enters a query, and the agent responds with appropriate answers or performs requested tasks.

### Independent Test Criteria
Can be fully tested by logging in, entering a query, and verifying the agent responds appropriately. Delivers the core value of AI-powered assistance.

### Implementation Tasks

- [X] T010 [US1] Create OpenAI Agent with Google Gemini integration in todo-app-backend/src/agents/chat_agent.py
- [X] T011 [US1] Implement basic chat endpoint in todo-app-backend/src/api/chat_router.py
- [X] T012 [US1] Create chat service to handle agent interactions in todo-app-backend/src/services/chat_service.py
- [X] T013 [P] [US1] Create dedicated chat page component using OpenAI ChatKit in todo-app/src/app/chat/page.tsx
- [X] T014 [P] [US1] Create floating chat widget component using OpenAI ChatKit in todo-app/src/components/ChatWidget.tsx
- [X] T015 [P] [US1] Create chat API service in todo-app/src/services/chatService.ts
- [X] T016 [US1] Implement JWT validation for chat endpoints in todo-app-backend/src/api/chat_router.py
- [X] T017 [US1] Integrate agent with chat service to handle user queries in todo-app-backend/src/services/chat_service.py
- [X] T018 [US1] Connect frontend chat UI to backend API using OpenAI ChatKit in todo-app/src/components/ChatInterface.tsx

### Acceptance Tests
- [X] T019 [US1] Test that authenticated users can submit queries and receive responses within 10 seconds under normal load (up to 10 concurrent users)
- [X] T020 [US1] Test that unauthenticated users are denied access to chat functionality

## Phase 4: User Story 2 - Chat History Persistence (Priority: P2)

### Story Goal
The system stores all user queries, agent responses, and performed tasks in the database for future reference and analysis.

### Independent Test Criteria
Can be tested by submitting queries, performing tasks, and verifying that records are correctly stored in the database with all required fields.

### Implementation Tasks

- [ ] T021 [US2] Modify chat service to save interactions to ChatHistory in todo-app-backend/src/services/chat_service.py
- [ ] T022 [US2] Create endpoint to retrieve chat history for authenticated user in todo-app-backend/src/api/chat_router.py
- [ ] T023 [P] [US2] Create chat history UI component in todo-app/src/components/ChatHistory.tsx
- [ ] T024 [P] [US2] Create chat history service in todo-app/src/services/chatHistoryService.ts
- [ ] T025 [US2] Implement filtering and pagination for chat history in todo-app-backend/src/services/chat_history_service.py
- [ ] T026 [US2] Connect frontend chat history UI to backend API in todo-app/src/components/ChatHistory.tsx

### Acceptance Tests
- [ ] T027 [US2] Test that all chat interactions are stored in the database with user_query, agent_response, and task_performed fields
- [ ] T028 [US2] Test that users can only access their own chat history

## Phase 5: User Story 3 - Todo Task Execution (Priority: P3)

### Story Goal
The agent can perform todo-related tasks such as creating, updating, or deleting todo items by accessing the existing database through the backend services.

### Independent Test Criteria
Can be tested by asking the agent to perform specific todo operations and verifying they are executed correctly in the database.

### Implementation Tasks

- [ ] T029 [US3] Create todo operation tools for agent in todo-app-backend/src/agents/todo_tools.py
- [ ] T030 [US3] Implement create todo tool that works through existing service layer in todo-app-backend/src/agents/todo_tools.py
- [ ] T031 [US3] Implement update todo tool that works through existing service layer in todo-app-backend/src/agents/todo_tools.py
- [ ] T032 [US3] Implement delete todo tool that works through existing service layer in todo-app-backend/src/agents/todo_tools.py
- [ ] T033 [US3] Implement toggle completion tool that works through existing service layer in todo-app-backend/src/agents/todo_tools.py
- [ ] T034 [US3] Register todo tools with the agent in todo-app-backend/src/agents/chat_agent.py
- [ ] T035 [US3] Update chat agent to recognize and execute todo-related commands in todo-app-backend/src/agents/chat_agent.py
- [ ] T036 [US3] Add UI indicators for agent-performed todo operations in todo-app/src/components/ChatInterface.tsx

### Acceptance Tests
- [ ] T037 [US3] Test that agent can create new todo items when requested
- [ ] T038 [US3] Test that agent can update existing todo items when requested
- [ ] T039 [US3] Test that agent can delete todo items when requested
- [ ] T040 [US3] Test that agent can toggle completion status of todo items when requested

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T041 Implement error handling with specific user notifications in todo-app-backend/src/agents/chat_agent.py
- [ ] T041a Implement authentication error handling in todo-app-backend/src/agents/chat_agent.py
- [ ] T041b Implement database error handling in todo-app-backend/src/agents/chat_agent.py
- [ ] T041c Implement LLM API error handling in todo-app-backend/src/agents/chat_agent.py
- [ ] T042 [P] Add error handling to frontend chat components in todo-app/src/components/ChatInterface.tsx
- [ ] T042a Add network error handling to frontend chat components in todo-app/src/components/ChatInterface.tsx
- [ ] T042b Add timeout handling to frontend chat components in todo-app/src/components/ChatInterface.tsx
- [ ] T043 Create TodoOperationLog model to track specific todo operations by agent in todo-app-backend/src/models/todo_operation_log_model.py
- [ ] T044 Update chat history to link to todo operations when applicable in todo-app-backend/src/services/chat_service.py
- [ ] T045 Add rate limiting to chat endpoints (100 requests/hour per IP) in todo-app-backend/src/api/chat_router.py
- [ ] T046 Update documentation for new chat functionality in todo-app-backend/README.md
- [ ] T047 Update documentation for new chat functionality in todo-app/README.md
- [ ] T048 Write comprehensive tests for all new backend functionality in todo-app-backend/tests/
- [ ] T048a Add unit tests for chat agent functionality in todo-app-backend/tests/test_chat_agent.py
- [ ] T048b Add integration tests for chat endpoints in todo-app-backend/tests/test_chat_endpoints.py
- [ ] T048c Add unit tests for agent tools in todo-app-backend/tests/test_agent_tools.py
- [ ] T048d Add tests for unsupported query types in todo-app-backend/tests/test_edge_cases.py
- [ ] T048e Add tests for authentication failures during chat in todo-app-backend/tests/test_edge_cases.py
- [ ] T048f Add tests for database unavailability during chat in todo-app-backend/tests/test_edge_cases.py
- [ ] T049 Write comprehensive tests for all new frontend functionality in todo-app/__tests__/
- [ ] T049a Add unit tests for chat UI components in todo-app/__tests__/chatComponents.test.tsx
- [ ] T049b Add integration tests for chat functionality in todo-app/__tests__/chatIntegration.test.tsx
- [ ] T049c Add tests for handling long user queries in todo-app/__tests__/edgeCases.test.tsx
- [ ] T049d Add tests for handling long agent responses in todo-app/__tests__/edgeCases.test.tsx
- [ ] T050 Perform end-to-end testing of complete chat functionality with todo operations