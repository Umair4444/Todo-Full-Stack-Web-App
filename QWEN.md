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

## Project Structure

```text
todo-backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── todo_model.py
│   │   └── user_model.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── todo_router.py
│   │   └── user_router.py
│   ├── database/
│   │   ├── __init__.py
│   │   └── database.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_todo_api.py
│   └── test_user_api.py
├── requirements.txt
├── requirements-dev.txt
└── alembic/
    ├── env.py
    ├── script.py.mako
    └── versions/
```

## Commands

- Activate Python virtual environment before package operations
- Install dependencies with uv: `uv pip install -r requirements.txt`
- Run tests: `pytest`
- Run development server: `uvicorn src.main:app --reload`
- Run with production server: `gunicorn -k uvicorn.workers.UvicornWorker src.main:app`

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

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->