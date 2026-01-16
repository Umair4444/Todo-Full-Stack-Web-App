# How-To: Set Up Development Environment

## Overview
This guide explains how to set up a local development environment for the Todo Backend API.

## Prerequisites

Before starting, ensure you have the following installed:

- Python 3.11 or higher
- Git
- pip (Python package installer)
- A PostgreSQL client (for local database setup)
- A code editor (VS Code, PyCharm, etc.)

## Step 1: Clone the Repository

1. Open a terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Run the following command:

```bash
git clone <repository-url>
cd todo-backend
```

## Step 2: Create a Virtual Environment

It's recommended to use a virtual environment to manage dependencies:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

## Step 3: Install Dependencies

With the virtual environment activated, install the project dependencies:

```bash
# Upgrade pip first
pip install --upgrade pip

# Install uv package manager
pip install uv

# Install project dependencies
uv pip install -r requirements.txt

# Install development dependencies
uv pip install -r requirements-dev.txt
```

## Step 4: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your specific configuration:
```bash
nano .env  # Or use your preferred text editor
```

3. Update the following values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: A random secret key for JWT tokens
   - `ENVIRONMENT`: Set to "development"

Example `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_dev
SECRET_KEY=your-super-secret-key-change-this-in-production
ENVIRONMENT=development
LOG_LEVEL=DEBUG
```

## Step 5: Set Up the Database

### Option A: Local PostgreSQL Database

1. Install PostgreSQL on your system if not already installed
2. Create a database for the project:
```sql
CREATE DATABASE todo_dev;
CREATE USER username WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE todo_dev TO username;
```

3. Run the database initialization script:
```bash
python init_db.py
```

### Option B: Neon Serverless PostgreSQL

1. Sign up for a Neon account at https://neon.tech/
2. Create a new project
3. Get the connection string from the Neon dashboard
4. Update your `DATABASE_URL` in the `.env` file

## Step 6: Run Database Migrations

If using Alembic for database migrations:

```bash
# Run pending migrations
alembic upgrade head
```

## Step 7: Run the Development Server

Start the development server:

```bash
# Using uvicorn directly
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Or using the start script
python start_server.py
```

The API will be available at `http://localhost:8000`.

## Step 8: Run Tests

To run the test suite:

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_todo_api.py
```

## Step 9: Code Formatting and Linting

Format your code using the configured tools:

```bash
# Format code with black
black src/

# Lint code with flake8
flake8 src/

# Check types with mypy
mypy src/
```

## Useful Development Commands

### Start the server with auto-reload:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Generate a new database migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply database migrations:
```bash
alembic upgrade head
```

### Run tests with coverage:
```bash
pytest --cov=src --cov-report=term-missing
```

### Format all code:
```bash
black src/ tests/
```

## Troubleshooting

### Common Issues

1. **Import errors after installing dependencies:**
   - Ensure you're in the correct virtual environment
   - Try reinstalling dependencies: `pip install -r requirements.txt`

2. **Database connection errors:**
   - Verify your `DATABASE_URL` in `.env` is correct
   - Check that your PostgreSQL server is running
   - Ensure the database exists and has proper permissions

3. **Port already in use:**
   - Change the port: `uvicorn src.main:app --reload --port 8001`

4. **Permission errors on Windows:**
   - Run your terminal as administrator
   - Or adjust your Python installation to allow user installs

### Verifying Setup

To verify your development environment is set up correctly:

1. The development server starts without errors
2. You can access the API documentation at `http://localhost:8000/docs`
3. Tests run successfully: `pytest`
4. You can make API requests to the endpoints

## Next Steps

Once your development environment is set up:

1. Explore the API documentation at `http://localhost:8000/docs`
2. Run the existing tests to ensure everything works
3. Make a small change and test the auto-reload functionality
4. Review the project structure and codebase
5. Look at the existing tests to understand the testing approach