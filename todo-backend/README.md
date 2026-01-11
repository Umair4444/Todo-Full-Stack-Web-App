# Todo Backend API

A FastAPI backend for managing todo items with Neon Serverless PostgreSQL and SQLModel ORM.

## Features

- RESTful API endpoints for todo management
- Create, read, update, and delete todo items
- Filtering and pagination support
- Health check endpoint
- Proper error handling
- Rate limiting (100 requests/hour per IP)
- Comprehensive test suite
- API client SDK for easy integration
- Consistent error response format

## Prerequisites

- Python 3.11 or higher
- uv package manager (for Python dependencies)
- Access to Neon Serverless PostgreSQL (connection string)

## Setup Instructions

### 1. Create and Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install uv Package Manager (if not already installed)

```bash
pip install uv
```

### 3. Install Dependencies

```bash
# Activate virtual environment first
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies using uv
uv pip install -r requirements.txt
uv pip install -r requirements-dev.txt  # For development/testing
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
TEST_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/test_dbname?sslmode=require
```

### 5. Initialize the Database

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
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The application will be accessible at `http://localhost:8000`.

### Production Mode

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run with gunicorn (install if needed: pip install gunicorn)
gunicorn -k uvicorn.workers.UvicornWorker main:app --workers 4 --bind 0.0.0.0:8000
```

## API Endpoints

Once the application is running, you can access the following endpoints:

### Todo Items
- `GET /api/v1/todos` - Get all todo items
- `POST /api/v1/todos` - Create a new todo item
- `GET /api/v1/todos/{id}` - Get a specific todo item
- `PUT /api/v1/todos/{id}` - Update a specific todo item
- `DELETE /api/v1/todos/{id}` - Delete a specific todo item

### Health Check
- `GET /health` - Check the health status of the application

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## API Client SDK

The repository includes a Python API client SDK (`src/api_client.py`) that provides convenient methods to interact with the Todo Backend API.

### Installation

```bash
pip install requests
```

### Usage

```python
from src.api_client import TodoAPIClient

# Initialize the client
client = TodoAPIClient(base_url="http://localhost:8000")

# Create a new todo
new_todo = client.create_todo(
    title="Sample Todo",
    description="This is a sample todo item",
    is_completed=False
)

# Get all todos
todos = client.get_todos()

# Update a todo
updated_todo = client.update_todo(
    todo_id=new_todo["id"],
    title="Updated Sample Todo",
    is_completed=True
)

# Delete a todo
delete_result = client.delete_todo(new_todo["id"])
```

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

## Configuration

### Settings Location
Application settings are managed in `src/config/settings.py` using Pydantic's BaseSettings.

### Key Configuration Options
- `DATABASE_URL` - Connection string for the PostgreSQL database
- `SECRET_KEY` - Secret key for JWT token signing
- `ALGORITHM` - Algorithm for JWT token encoding
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Performance

The API is designed to respond to requests in under 200ms for 95% of requests under normal load conditions.

## Security

- Rate limiting: 100 requests per hour per IP address
- Input validation through Pydantic models
- SQL injection prevention through SQLModel/SQLAlchemy
- CORS enabled for frontend integration