# Implementation Plan: ChatKit Agent Integration

## Technical Context

- **Frontend**: Next.js 16.0.10 with TypeScript
- **Backend**: Python FastAPI with SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens
- **Target Feature**: OpenAI ChatKit UI with OpenAI Agents SDK using OpenAIChatCompletionsModel with Google Models
- **Environment**: Existing todo application with established patterns and architecture

### Unknowns (NEEDS CLARIFICATION)
None - all research questions have been addressed in research.md

## Constitution Check

### Security Requirements
- [ ] All database operations must respect user permissions
- [ ] JWT tokens must be validated for all protected operations
- [ ] Agent access to database must be properly authenticated
- [ ] Sensitive API keys must not be exposed to frontend

### Architecture Requirements
- [ ] Follow existing code patterns in the application
- [ ] Maintain separation of concerns between frontend and backend
- [ ] Use established authentication middleware
- [ ] Leverage existing database models where possible

### Quality Requirements
- [ ] All new functionality must have tests
- [ ] Error handling must be comprehensive
- [ ] Performance should not degrade existing functionality
- [ ] Code must follow established style guides

## Gates Evaluation

### Security Gate
- [ ] Agent database access must go through authenticated endpoints
- [ ] JWT validation must be enforced for all chat operations
- [ ] Chat history must be isolated by user

### Architecture Gate
- [ ] New components must follow existing patterns
- [ ] Database schema changes must be backward compatible
- [ ] API endpoints must follow existing conventions

### Quality Gate
- [ ] Test coverage must meet project standards
- [ ] Performance benchmarks must be maintained
- [ ] Error handling must be comprehensive

## Phase 0: Research

### Completed Research
All research tasks have been completed and documented in research.md:
1. How to use OpenAIChatCompletionsModel with Google Gemini (using LiteLLM)
2. Best practices for chat history storage in PostgreSQL with SQLModel
3. Implementation of agent tools for todo operations
4. Authentication context handling in agent operations
5. UI patterns for both dedicated page and floating widget

### Outcomes Achieved
- ✓ Clear understanding of how to integrate Google Gemini with OpenAI Agents SDK using LiteLLM
- ✓ Database schema for chat history defined in data-model.md
- ✓ Patterns for creating agent tools that interact with the existing todo functionality
- ✓ Authentication flow for agent operations
- ✓ UI implementation approach for both interfaces

## Phase 1: Design & Contracts

### Data Model
- ✓ Define ChatHistory model with required fields (see data-model.md)
- ✓ Define AgentSession model if needed (see data-model.md)
- ✓ Define any additional models for agent functionality (see data-model.md)

### API Contracts
- ✓ Define endpoints for chat operations (see contracts/api-contract.yaml)
- ✓ Define authentication requirements for chat endpoints (see contracts/api-contract.yaml)
- ✓ Define data transfer objects for chat interactions (see contracts/api-contract.yaml)

### Quickstart Guide
- ✓ Steps to set up the new functionality (see quickstart.md)
- ✓ Environment variables needed (see quickstart.md)
- ✓ Testing instructions (see quickstart.md)

### Agent Context Update
- ✓ Research completed on how to integrate with existing codebase
- ✓ Dependencies to install: openai-agents and openai-agents[litellm] for backend, @openai/chatkit-react for frontend