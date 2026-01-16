# Todo-Full-Stack-Web-App Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-10

## Active Technologies

- Python 3.11
- FastAPI (0.115.0) - Modern, fast web framework for building APIs with Python
- SQLModel (0.0.22) - SQL databases with Python, combining SQLAlchemy and Pydantic
- Neon (3.2.0) - Serverless PostgreSQL for simplified database management
- Uvicorn (0.32.0) - ASGI server for running FastAPI applications
- Pydantic (2.9.2) - Data validation and settings management
- Alembic (1.13.2) - Database migration tool
- python-multipart (0.0.20) - For handling form data in FastAPI
- Neon Serverless PostgreSQL with SQLModel ORM
- pytest with FastAPI test client, coverage for 80%+ code coverage

```
todo-app-backend/
├── main.py                 # Main application entry point
├── app.py                  # Previous version (deprecated)
├── start_server.py         # Server startup script
├── Dockerfile              # Container configuration
├── requirements.txt        # Production dependencies
├── requirements-dev.txt    # Development dependencies
├── alembic.ini             # Database migration configuration
├── .env                    # Environment variables (local)
├── .env.example            # Example environment variables
├── pyproject.toml          # Project configuration
├── scripts/                # Utility and debugging scripts
│   ├── debug_*.py         # Debugging scripts
│   ├── check_*.py         # Database checking scripts
│   ├── fix_schema.py      # Schema fixing script
│   ├── reset_db_schema.py # Schema reset script
│   ├── verify_logs_format.py # Log verification script
│   ├── init_db.py         # Database initialization script
│   └── test_*.py          # Test scripts
├── src/                   # Source code
│   ├── api/              # API route definitions
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── database/         # Database configuration
│   ├── middleware/       # Middleware implementations
│   ├── config/           # Application settings
│   ├── monitoring.py     # Monitoring and observability
│   └── exception_handlers.py # Global exception handlers
├── tests/                 # Test files
├── docs/                  # Documentation
└── alembic/              # Database migration files
    └── versions/         # Migration version files
```

## Application Entry Points

- `main.py` - Current main application entry point with authentication support and lifespan context manager
- `app.py` - Previous version without authentication support (deprecated)

## Directory Organization

- `scripts/` - Utility and debugging scripts
- Root directory - Essential runtime files and project metadata

## Commands

- Activate Python virtual environment before package operations
- Install dependencies with uv: `uv pip install -r requirements.txt`
- Run tests: `pytest`
- Run development server: `uvicorn main:app --reload`
- Run with production server: `gunicorn -k uvicorn.workers.UvicornWorker main:app`

## Code Style

- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Use docstrings for all public classes and functions
- Use async/await for I/O-bound operations
- Use dependency injection for database sessions
- Use Pydantic models for request/response validation

## Recent Changes

- 001-fastapi-todo-backend: Implemented FastAPI backend with Neon Serverless PostgreSQL and SQLModel ORM
- Added TodoItem model with CRUD operations
- Created API endpoints for managing todo items
- Implemented proper error handling and validation

## Implementation Details Added

### Backend Implementation (todo-backend)

#### Tech Stack
- **Framework**: FastAPI (0.115.0)
- **ORM**: SQLModel (0.0.22)
- **Database**: Neon Serverless PostgreSQL
- **Server**: Uvicorn (0.32.0)
- **Validation**: Pydantic (2.9.2)
- **Migration Tool**: Alembic (1.13.2)

#### Key Features Implemented
1. **CRUD Operations**: Full create, read, update, and delete functionality for todo items
2. **Data Validation**: Comprehensive input validation using Pydantic
3. **Error Handling**: Structured error responses with appropriate HTTP status codes
4. **Rate Limiting**: 100 requests/hour per IP address
5. **Logging**: Comprehensive request/response logging
6. **Health Checks**: Endpoints to verify service availability
7. **API Documentation**: Auto-generated with Swagger UI and ReDoc
8. **CORS Support**: Configured for frontend integration

#### Data Models
- **TodoItem**: Represents a todo item with title, description, completion status, and timestamps
- **TodoItemCreate**: Subset of TodoItem attributes for creating new items
- **TodoItemUpdate**: Allows partial updates of todo items
- **TodoItemResponse**: Complete representation for API responses

#### API Endpoints
- `GET /api/v1/todos` - Retrieve all todo items with pagination and filtering
- `POST /api/v1/todos` - Create a new todo item
- `GET /api/v1/todos/{id}` - Retrieve a specific todo item
- `PUT /api/v1/todos/{id}` - Update a specific todo item
- `DELETE /api/v1/todos/{id}` - Delete a specific todo item
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

#### Security Measures
- Input sanitization and validation
- Rate limiting to prevent abuse
- CORS configuration to prevent XSS attacks

#### Performance Optimizations
- Connection pooling for database connections
- Efficient query construction with SQLModel
- Proper indexing on database tables
- Asynchronous request handling

#### Testing Strategy
- Unit tests for individual functions
- Integration tests for API endpoints
- Test coverage of 80%+ of the codebase
- Database testing with temporary test databases

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

#### Deployment Options
- Cloud platform deployment (Railway, Heroku, etc.)
- Containerized deployment with Docker
- Direct server deployment with systemd
- Kubernetes deployment manifests

#### Documentation
- Comprehensive API documentation
- How-to guides for common tasks
- Deployment documentation
- Performance testing procedures

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->