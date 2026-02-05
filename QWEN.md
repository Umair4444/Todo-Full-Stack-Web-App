# Todo-Full-Stack-Web-App Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-21

## Active Technologies

### Backend (Python/FastAPI)
- Python 3.11
- FastAPI (0.115.0) - Modern, fast web framework for building APIs with Python
- SQLModel (0.0.22) - SQL databases with Python, combining SQLAlchemy and Pydantic
- Uvicorn (0.32.0) - ASGI server for running FastAPI applications
- Pydantic (2.9.2) - Data validation and settings management
- Alembic (1.13.2) - Database migration tool
- python-multipart (0.0.20) - For handling form data in FastAPI
- psycopg2-binary (2.9.9) - PostgreSQL adapter
- bcrypt (4.2.0) - Password hashing
- python-jose[cryptography] (3.3.0) - JWT token handling
- passlib[bcrypt] (1.7.4) - Password utilities
- slowapi (0.1.9) - Rate limiting
- python-dotenv (1.0.1) - Environment variable management
- asyncpg (0.30.0) - Async PostgreSQL driver
- psutil (6.0.0) - System monitoring
- prometheus-client (0.20.0) - Metrics collection
- openai-agents (0.0.10) - OpenAI Agents SDK for building multi-agent workflows
- openai-agents[litellm] (0.0.10) - LiteLLM extension for multi-provider LLM support including Google Gemini

### Frontend (Next.js/React)
- Next.js (16.0.1) - React framework
- React (19.2.0) - UI library
- TypeScript (5.9.3) - Type checking
- Tailwind CSS (4.1.18) - Styling framework
- shadcn/ui (0.9.5) - Component library
- Framer Motion (12.24.11) - Animations
- Zustand (5.0.9) - State management
- React Hook Form (7.70.0) - Form handling
- Zod (4.3.5) - Schema validation
- Sonner (2.0.7) - Toast notifications
- Lucide React (0.562.0) - Icon library
- next-i18next (15.4.3) - Internationalization
- Axios (1.13.2) - HTTP client
- UUID (13.0.0) - UUID generation
- Vitest (4.0.16) - Testing framework
- @openai/chatkit-react (1.0.0) - OpenAI ChatKit UI components for chat interfaces

## Project Structure

```text
Todo-Full-Stack-Web-App/
├── specs/
│   ├── 001-fastapi-todo-backend/
│   ├── 1-chatkit-agent-integration/
│   ├── 1-todo-frontend-app/
│   └── 3-auth-todo-app/
├── todo-app/ (Next.js frontend)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── pages/
│   ├── __tests__/ (unit and integration tests)
│   ├── tests/ (integration tests)
│   ├── .env.example
│   ├── next.config.ts
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
├── todo-app-backend/ (FastAPI backend)
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth_router.py
│   │   │   ├── health_router.py
│   │   │   ├── todo_log_router.py
│   │   │   ├── todo_router.py
│   │   │   └── response_format.py
│   │   ├── models/
│   │   │   ├── todo_model.py
│   │   │   └── user_model.py
│   │   ├── database/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── monitoring.py
│   │   ├── exception_handlers.py
│   │   └── main.py
│   ├── tests/
│   ├── docs/
│   ├── scripts/
│   ├── alembic/
│   ├── .env
│   ├── .env.example
│   ├── main.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pyproject.toml
│   ├── README.md
│   └── API_DOCUMENTATION.md
├── .gitignore
├── IMPLEMENTATION_SUMMARY.md
├── QWEN.md
└── README.md
```

## Commands

### Backend Commands
- Activate Python virtual environment before package operations
- Install dependencies with uv: `uv pip install -r requirements.txt`
- Run tests: `pytest`
- Run development server: `uvicorn src.main:app --reload`
- Run with production server: `gunicorn -k uvicorn.workers.UvicornWorker src.main:app`

### Frontend Commands
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm run test`
- Lint code: `npm run lint`

## Code Style

- Follow PEP 8 style guidelines for Python
- Use type hints for all function parameters and return values
- Use docstrings for all public classes and functions
- Use async/await for I/O-bound operations
- Use dependency injection for database sessions
- Use Pydantic models for request/response validation
- Follow Next.js best practices for React/TypeScript code
- Use Tailwind CSS utility classes consistently
- Follow shadcn/ui component patterns

## Recent Changes

- 001-fastapi-todo-backend: Implemented FastAPI backend with PostgreSQL and SQLModel ORM
- Added TodoItem and User models with CRUD operations
- Created API endpoints for managing todo items and users
- Implemented authentication with JWT tokens
- Added priority management for todo items
- Implemented bulk delete functionality
- Added toggle completion endpoint
- Created comprehensive Next.js frontend with modern UI
- Added multilingual support (English/Urdu)
- Implemented dark/light mode
- Added activity logs for todo actions
- Integrated with backend API for all operations
- Added comprehensive testing and monitoring
- 1-chatkit-agent-integration: Added OpenAI ChatKit UI with OpenAI Agents SDK using OpenAIChatCompletionsModel with Google Gemini support
- Integrated @openai/chatkit-react for chat interface components
- Added openai-agents and openai-agents[litellm] for agent functionality with Google Gemini Pro
- Implemented chat history persistence in database
- Added agent tools for todo operations

## Implementation Details Added

### Backend Implementation (todo-app-backend)

#### Tech Stack
- **Framework**: FastAPI (0.115.0)
- **ORM**: SQLModel (0.0.22)
- **Database**: PostgreSQL (with support for Neon Serverless)
- **Server**: Uvicorn (0.32.0)
- **Validation**: Pydantic (2.9.2)
- **Migration Tool**: Alembic (1.13.2)
- **Authentication**: JWT with bcrypt hashing
- **Monitoring**: Prometheus metrics
- **AI Agents**: OpenAI Agents SDK with LiteLLM extension for multi-provider LLM support

#### Key Features Implemented
1. **CRUD Operations**: Full create, read, update, and delete functionality for todo items
2. **User Management**: Registration, login, and authentication with JWT tokens
3. **Data Validation**: Comprehensive input validation using Pydantic
4. **Error Handling**: Structured error responses with appropriate HTTP status codes
5. **Rate Limiting**: 100 requests/hour per IP address
6. **Logging**: Comprehensive request/response logging
7. **Health Checks**: Endpoints to verify service availability
8. **API Documentation**: Auto-generated with Swagger UI and ReDoc
9. **CORS Support**: Configured for frontend integration
10. **Priority Management**: Support for low/medium/high priority levels
11. **Bulk Operations**: Bulk delete functionality for multiple todo items
12. **Toggle Completion**: Dedicated endpoint to toggle completion status
13. **Activity Logging**: Track creation, updates, and deletions of todo items
14. **AI Agent Integration**: OpenAI Agents SDK with Google Gemini support via LiteLLM
15. **Chat History**: Persistent storage of user queries, agent responses, and performed tasks
16. **Agent Tools**: Specialized tools for performing todo operations through the agent

#### Data Models
- **TodoItem**: Represents a todo item with title, description, completion status, priority, and timestamps
- **TodoItemCreate**: Subset of TodoItem attributes for creating new items
- **TodoItemUpdate**: Allows partial updates of todo items
- **TodoItemResponse**: Complete representation for API responses
- **User**: Represents a user with email, password hash, and account status
- **UserCreate**: Attributes for registering new users
- **UserUpdate**: Allows partial updates of user information
- **UserResponse**: Complete representation for user API responses
- **ChatHistory**: Stores chat interactions with user_query, agent_response, and task_performed fields

#### API Endpoints
- `GET /api/todos` - Retrieve all todo items with pagination and filtering
- `POST /api/todos` - Create a new todo item
- `GET /api/todos/{id}` - Retrieve a specific todo item
- `PUT /api/todos/{id}` - Update a specific todo item
- `DELETE /api/todos/{id}` - Delete a specific todo item
- `POST /api/todos/bulk-delete` - Delete multiple todo items by ID
- `PATCH /api/todos/{id}/toggle-completion` - Toggle completion status of a todo item
- `GET /api/todos/logs` - Retrieve activity logs for todo items
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/logout` - Logout user (invalidate session)
- `GET /api/chat/session` - Initiate new chat session with AI agent
- `POST /api/chat/session/{session_id}/message` - Send message to chat session
- `GET /api/chat/history` - Retrieve chat history for authenticated user
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics endpoint
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

#### Security Measures
- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- Input sanitization and validation
- Rate limiting to prevent abuse
- CORS configuration to prevent XSS attacks
- SQL injection prevention through SQLModel/SQLAlchemy
- Agent operations validated within authenticated user context

#### Performance Optimizations
- Connection pooling for database connections
- Efficient query construction with SQLModel
- Proper indexing on database tables
- Asynchronous request handling
- Optimized API response formatting

#### Testing Strategy
- Unit tests for individual functions
- Integration tests for API endpoints
- Database testing with temporary test databases
- Performance testing with concurrent request simulation

### Frontend Implementation (todo-app)

#### Tech Stack
- **Framework**: Next.js 16.0.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Internationalization**: next-i18next
- **Authentication**: Better Auth with JWT tokens
- **Chat UI**: @openai/chatkit-react for ChatKit UI components

#### Key Features Implemented
1. **User Authentication**: Secure registration and login with JWT-based authentication
2. **Task Management**: Create, read, update, and delete todo items
3. **Enhanced Toggle UX**: Intuitive and responsive completion toggles with visual feedback
4. **Bulk Operations**: Select and delete multiple todo items at once with confirmation dialog
5. **Filtering & Sorting**: Filter tasks by status (active/completed) and priority (low/medium/high)
6. **Activity Logs**: Track and view history of todo actions (create, update, delete)
7. **Responsive Design**: Works seamlessly across all device sizes
8. **Dark/Light Mode**: Toggle between light and dark themes
9. **Multilingual Support**: Available in English and Urdu
10. **Floating Navbar**: With glass effect that hides on scroll down and appears on scroll up
11. **Simulated Chatbot**: Get help and support through the chatbot available on all pages
12. **Modern UI**: Built with shadcn/ui components and Framer Motion animations
13. **Persistent Storage**: Todos and preferences are saved in localStorage
14. **AI Chat Interface**: OpenAI ChatKit UI components for seamless agent interaction
15. **Dual UI Modes**: Both dedicated chat page and floating widget implementations

#### Components
- **TodoForm**: For creating and updating todo items
- **TodoItem**: Individual todo item with completion toggle and priority indicator
- **TodoList**: Container for displaying multiple todo items with filtering options
- **Navbar**: Responsive navigation with theme toggle and user authentication
- **AuthModal**: Registration and login forms with validation
- **BulkActions**: Controls for selecting and performing bulk operations on todo items
- **ActivityLog**: Display of historical actions performed on todo items
- **ThemeToggle**: Switch between light and dark modes
- **LanguageSwitcher**: Toggle between English and Urdu languages
- **ChatInterface**: OpenAI ChatKit UI component for agent interaction
- **ChatWidget**: Floating chat widget for quick access
- **ChatHistory**: Component to display conversation history

#### Pages
- **Home Page**: Main dashboard with todo list and controls
- **Login/Register**: Authentication pages
- **Activity Log**: Detailed view of todo actions history
- **Settings**: User preferences and application settings
- **Chat Page**: Dedicated page for extended chat interactions

#### API Integration
- **Backend Connection**: Connects to Python FastAPI backend
- **Authentication Flow**: JWT token management and secure API calls
- **Data Synchronization**: Real-time sync between frontend and backend
- **Error Handling**: Graceful handling of API errors and network issues
- **Chat Service**: Specialized service for agent communication

### DevOps and Deployment

#### CI/CD Pipeline
- Automated testing on pull requests
- Code quality checks (linting, security scanning)
- Automated deployment to staging environment
- Manual approval for production deployment

#### Monitoring and Observability
- Application performance monitoring
- Error tracking and alerting
- System resource monitoring
- Custom business metrics tracking
- Prometheus metrics collection

#### Deployment Options
- Cloud platform deployment (Railway, Heroku, etc.)
- Containerized deployment with Docker
- Direct server deployment with systemd
- Kubernetes deployment manifests
- Hugging Face Spaces (for backend)

#### Documentation
- Comprehensive API documentation
- How-to guides for common tasks
- Deployment documentation
- Performance testing procedures

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->