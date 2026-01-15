# Implementation Plan: Better Auth Integration – Next.js App Router + FastAPI + Neon PostgreSQL

## Technical Context

### Frontend Architecture
- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Better Auth with JWT stored in secure HTTP-only cookies
- **Package Manager**: npm

### Backend Architecture
- **Framework**: FastAPI (Python, async)
- **Database**: Neon PostgreSQL
- **Authentication**: JWT verification
- **Package Manager**: uv

### Integration Points
- Frontend handles authentication using Better Auth with JWT stored in secure HTTP-only cookies
- Frontend communicates with backend via API calls
- JWT tokens passed in Authorization headers
- Backend validates JWT and filters data by user ID
- All user data is isolated by user ID

### Known Unknowns
- Specific JWT signing algorithm to use
- How to securely share JWT secret between frontend and backend
- Error handling implementation details (using sonner or alerts)
- Database connection pooling configuration
- Rate limiting implementation for authentication endpoints

## Constitution Check

### Compliance Verification
- ✅ TypeScript with Next.js version 16.0.1 (as per constitution)
- ✅ Python for backend development (as per constitution)
- ✅ npm for frontend dependencies (as per constitution)
- ✅ uv for Python dependencies (as per constitution)
- ✅ Python virtual environment activation requirement (as per constitution)
- ✅ Test-driven development approach (as per constitution)
- ✅ README documentation for functionality (as per constitution)
- ✅ Context7 documentation standard (as per constitution)

### Potential Violations
None identified - all planned approaches comply with the constitution.

## Gates

### Gate 1: Architecture Feasibility
- [x] Next.js App Router supports Better Auth integration
- [x] FastAPI supports JWT validation middleware
- [x] Neon PostgreSQL compatible with SQLModel/SQLAlchemy
- [x] JWT token flow between frontend and backend is technically viable

### Gate 2: Security Compliance
- [x] JWT tokens stored in secure HTTP-only cookies
- [x] All backend routes validate JWT tokens
- [x] Database queries filtered by user ID
- [x] Password complexity requirements enforced

### Gate 3: Performance Requirements
- [x] System designed to handle 1000 concurrent users
- [x] Response times under 2 seconds for 95% of requests
- [x] Database indexing planned for user-specific queries

## Phase 0: Research & Resolution

### Research Tasks

#### 0.1 JWT Implementation Research
**Decision**: Use HS256 algorithm for JWT signing
**Rationale**: Simpler to implement than RS256, sufficient for this application's security requirements
**Alternatives considered**: RS256 (more complex key management), symmetric vs asymmetric encryption

#### 0.2 JWT Secret Management
**Decision**: Store JWT secret in environment variables on both frontend and backend
**Rationale**: Environment variables provide separation of configuration from code
**Alternatives considered**: Storing in database, using separate secrets management service

#### 0.3 Error Handling Implementation
**Decision**: Use sonner for toast notifications in the UI
**Rationale**: Provides better UX than basic alerts, integrates well with React/Next.js
**Alternatives considered**: Native browser alerts, custom modal dialogs

#### 0.4 Database Connection Pooling
**Decision**: Use SQLModel's built-in connection pooling with Neon
**Rationale**: Leverages existing ORM capabilities, optimized for Neon PostgreSQL
**Alternatives considered**: Manual connection management, separate pooling library

#### 0.5 Rate Limiting Implementation
**Decision**: Implement rate limiting using slowapi for FastAPI
**Rationale**: Well-documented, async-compatible solution for FastAPI
**Alternatives considered**: Redis-based rate limiting, client-side rate limiting

## Phase 1: Design & Contracts

### 1.1 Data Model Design

#### User Entity
- `id`: UUID (Primary Key)
- `email`: String (Unique, Indexed)
- `password_hash`: String (Required)
- `first_name`: String (Optional)
- `last_name`: String (Optional)
- `created_at`: DateTime (Indexed)
- `updated_at`: DateTime
- `is_active`: Boolean (Default: True)

#### Todo Entity
- `id`: UUID (Primary Key)
- `title`: String (Required)
- `description`: Text (Optional)
- `is_completed`: Boolean (Default: False)
- `user_id`: UUID (Foreign Key to User.id, Indexed)
- `created_at`: DateTime (Indexed)
- `updated_at`: DateTime
- `completed_at`: DateTime (Optional)

#### TodoLog Entity
- `id`: UUID (Primary Key)
- `action`: String (Enum: 'CREATE', 'UPDATE', 'DELETE')
- `todo_id`: UUID (Foreign Key to Todo.id, Optional)
- `user_id`: UUID (Foreign Key to User.id, Indexed)
- `timestamp`: DateTime (Indexed)
- `previous_state`: JSON (Optional)
- `new_state`: JSON (Optional)

### 1.2 API Contract Design

#### Authentication Endpoints

##### POST /api/auth/register
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string (min 8 chars with upper, lower, number, special)",
    "first_name": "string (optional)",
    "last_name": "string (optional)"
  }
  ```
- **Responses**:
  - 201: User created, JWT token returned
  - 400: Invalid input
  - 409: Email already exists

##### POST /api/auth/login
- **Description**: Authenticate user and return JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses**:
  - 200: JWT token returned
  - 400: Invalid credentials
  - 401: Account inactive

##### POST /api/auth/logout
- **Description**: Logout user (invalidate session)
- **Headers**: Authorization: Bearer <token>
- **Responses**:
  - 200: Successfully logged out

#### Todo Management Endpoints

##### GET /api/todos
- **Description**: Get all todos for authenticated user
- **Headers**: Authorization: Bearer <token>
- **Query Params**: 
  - `status`: "active" | "completed" | "all" (default: "all")
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Responses**:
  - 200: Array of todos
  - 401: Unauthorized

##### POST /api/todos
- **Description**: Create a new todo for authenticated user
- **Headers**: Authorization: Bearer <token>
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)"
  }
  ```
- **Responses**:
  - 201: Todo created
  - 400: Invalid input
  - 401: Unauthorized

##### PUT /api/todos/{id}
- **Description**: Update a todo for authenticated user
- **Headers**: Authorization: Bearer <token>
- **Request Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "is_completed": "boolean (optional)"
  }
  ```
- **Responses**:
  - 200: Todo updated
  - 400: Invalid input
  - 401: Unauthorized
  - 404: Todo not found

##### DELETE /api/todos/{id}
- **Description**: Delete a todo for authenticated user
- **Headers**: Authorization: Bearer <token>
- **Responses**:
  - 204: Todo deleted
  - 401: Unauthorized
  - 404: Todo not found

#### Todo Log Endpoints

##### GET /api/todos/logs
- **Description**: Get activity logs for authenticated user
- **Headers**: Authorization: Bearer <token>
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `action`: "CREATE" | "UPDATE" | "DELETE" (optional)
- **Responses**:
  - 200: Array of log entries
  - 401: Unauthorized

### 1.3 Quickstart Guide

#### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (Neon recommended)
- npm
- uv

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Umair4444/Todo-Full-Stack-Web-App.git
   cd Todo-Full-Stack-Web-App
   ```

2. **Set up backend**
   ```bash
   cd todo-app-backend
   uv venv  # Create virtual environment
   source .venv/bin/activate  # Activate virtual environment (Linux/Mac)
   # or source .venv\Scripts\activate  # Windows
   uv pip install -r requirements.txt
   ```

3. **Set up frontend**
   ```bash
   cd ../todo-app
   npm install
   ```

4. **Configure environment variables**
   - Create `.env` files in both backend and frontend with appropriate values
   - Ensure JWT_SECRET is identical in both environments

5. **Initialize database**
   ```bash
   cd todo-app-backend
   source .venv/bin/activate
   python -m alembic upgrade head
   ```

6. **Run the applications**
   - Backend: `cd todo-app-backend && uv run uvicorn main:app --reload`
   - Frontend: `cd todo-app && npm run dev`

#### Development Workflow
1. Always activate Python virtual environment before backend operations
2. Follow test-driven development: Write tests before implementing functionality
3. Update README files when adding new features
4. Use Context7 for package/library documentation

## Phase 2: Implementation Plan

### 2.1 Frontend Implementation

#### Week 1: Authentication Setup
- Integrate Better Auth with Next.js App Router
- Configure Better Auth to store JWT in secure HTTP-only cookies
- Implement login, registration, and logout flows
- Set up protected route middleware
- Create reusable auth hooks and context

#### Week 2: UI Components
- Set up shadcn/ui with Tailwind
- Create dashboard layout with tabs
- Implement "My Todos" tab UI
- Implement "Completed" tab UI
- Implement "History" tab UI

#### Week 3: Error Handling & UX
- Integrate sonner for toast notifications
- Implement error boundaries
- Add loading states and skeleton screens
- Create reusable form components

### 2.2 Backend Implementation

#### Week 1: Authentication API
- Set up FastAPI application
- Implement JWT authentication middleware
- Create user registration and login endpoints
- Implement password hashing and validation

#### Week 2: Todo Management API
- Create Todo model and database schema
- Implement CRUD operations for todos
- Add user association to todos
- Implement proper error handling

#### Week 3: Logging & Security
- Create TodoLog model for tracking actions
- Implement logging for all todo operations
- Add rate limiting to authentication endpoints
- Implement input validation and sanitization

### 2.3 Testing Strategy

#### Unit Tests
- Write tests before implementation (TDD approach)
- Test all backend API endpoints
- Test JWT validation middleware
- Test database models and relationships
- Test frontend utility functions

#### Integration Tests
- Write tests before implementation (TDD approach)
- Test end-to-end authentication flow
- Test todo CRUD operations with authentication
- Test authorization (one user can't access another's data)

#### Performance Tests
- Write tests before implementation (TDD approach)
- Load test with 1000 concurrent users
- Measure response times under load
- Database query optimization

## Post-Design Constitution Check

### Updated Compliance Verification
- ✅ All implementation details align with constitution
- ✅ Technology stack requirements met
- ✅ Package management protocols followed
- ✅ Documentation requirements addressed
- ✅ Test-driven development approach maintained with tests written before implementation