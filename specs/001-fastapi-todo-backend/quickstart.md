# Quickstart Guide: FastAPI Todo Backend

## Overview
This guide provides instructions for setting up, running, and testing the FastAPI Todo backend application with Neon Serverless PostgreSQL and SQLModel ORM.

## Prerequisites
- Python 3.11 or higher
- uv package manager (for Python dependencies)
- Access to Neon Serverless PostgreSQL (connection string)
- Git (optional, for cloning the repository)

## Setup Instructions

### 1. Clone the Repository (if applicable)
```bash
git clone <repository-url>
cd todo-backend
```

### 2. Create and Activate Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install uv Package Manager (if not already installed)
```bash
pip install uv
```

### 4. Install Dependencies
```bash
# Activate virtual environment first
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies using uv
uv pip install -r requirements.txt
uv pip install -r requirements-dev.txt  # For development/testing
```

### 5. Set Up Environment Variables
Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
TEST_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/test_dbname?sslmode=require
```

### 6. Initialize the Database
```bash
# Run database migrations
alembic upgrade head
```

## Running the Application

### Development Mode
```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the development server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The application will be accessible at `http://localhost:8000`.

### Production Mode
```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run with gunicorn (install if needed: pip install gunicorn)
gunicorn -k uvicorn.workers.UvicornWorker src.main:app --workers 4 --bind 0.0.0.0:8000
```

## API Endpoints

Once the application is running, you can access the following endpoints:

### Todo Items
- `GET /api/v1/todos` - Get all todo items
- `POST /api/v1/todos` - Create a new todo item
- `GET /api/v1/todos/{id}` - Get a specific todo item
- `PUT /api/v1/todos/{id}` - Update a specific todo item
- `DELETE /api/v1/todos/{id}` - Delete a specific todo item

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## Testing

### Running Tests
```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run all tests
pytest

# Run tests with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_todo_api.py
```

### Test Structure
- `tests/conftest.py` - Shared test fixtures and configurations
- `tests/test_todo_api.py` - Integration tests for todo endpoints
- `tests/test_user_api.py` - Integration tests for user endpoints (if applicable)

## Database Migrations

### Creating New Migrations
```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Generate a new migration (after changing models)
alembic revision --autogenerate -m "Description of changes"

# Apply the migration
alembic upgrade head
```

### Applying Migrations
```bash
alembic upgrade head  # Apply all pending migrations
alembic downgrade -1  # Rollback the last migration
```

## Configuration

### Settings Location
Application settings are managed in `src/config/settings.py` using Pydantic's BaseSettings.

### Key Configuration Options
- `DATABASE_URL` - Connection string for the PostgreSQL database
- `SECRET_KEY` - Secret key for JWT token signing
- `ALGORITHM` - Algorithm for JWT token encoding
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
- Verify the `DATABASE_URL` in your `.env` file
- Ensure your Neon PostgreSQL instance is running
- Check firewall settings if connecting from a restricted network

#### 2. Dependency Installation Issues
- Ensure you're using the correct Python version (3.11+)
- Make sure the virtual environment is activated before installing dependencies
- Try clearing uv cache: `uv cache clean`

#### 3. Port Already in Use
- Change the port in the uvicorn command: `--port 8001`
- Kill the process using the port: `lsof -ti:8000 | xargs kill -9` (Linux/Mac)

### Checking Application Health
The application provides a health check endpoint:
- `GET /health` - Returns application status

## Development Workflow

### Adding New Features
1. Create a new branch: `git checkout -b feature/new-feature`
2. Update data models in `src/models/`
3. Create API endpoints in `src/api/`
4. Write tests in `tests/`
5. Update API documentation if needed
6. Commit changes and create a pull request

### Code Style
- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Write docstrings for all public classes and functions
- Use async/await for I/O-bound operations

## Deployment

### Preparing for Deployment
1. Ensure all tests pass: `pytest`
2. Update dependencies in `requirements.txt` if needed
3. Verify environment variables are properly configured
4. Test database migrations on a staging environment

### Deploying to Cloud Platforms
The application is designed to be deployed to cloud platforms like:
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Railway
- Heroku

Make sure to configure the appropriate environment variables for your deployment platform.