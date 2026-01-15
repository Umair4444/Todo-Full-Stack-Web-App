# Quickstart Guide: Better Auth Integration – Todo Application

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js 18+ (for the frontend)
- Python 3.11+ (for the backend)
- PostgreSQL (Neon PostgreSQL recommended)
- npm (Node.js package manager)
- uv (Python package manager)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Set Up the Backend

Navigate to the backend directory and set up the Python environment:

```bash
cd todo-app-backend
uv venv  # Create virtual environment
source .venv/bin/activate  # Activate virtual environment (Linux/Mac)
# or source .venv\Scripts\activate  # Windows
uv pip install -r requirements.txt
```

### 3. Set Up the Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd ../todo-app
npm install
```

### 4. Configure Environment Variables

Create `.env` files in both the backend and frontend directories with the appropriate values:

**Backend (.env):**
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEON_DATABASE_URL=your-neon-db-url
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

> ⚠️ Important: Ensure the JWT_SECRET is identical in both environments for proper authentication flow.

### 5. Initialize the Database

Run the database migrations to set up the required tables:

```bash
cd todo-app-backend
source .venv/bin/activate  # Activate virtual environment
python -m alembic upgrade head
```

### 6. Run the Applications

Start both the backend and frontend applications:

**Backend:**
```bash
cd todo-app-backend
source .venv/bin/activate
uv run uvicorn main:app --reload
```

**Frontend:**
```bash
cd todo-app
npm run dev
```

Both applications should now be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Development Workflow

### Backend Development

1. Always activate the Python virtual environment before performing any backend operations:
   ```bash
   source .venv/bin/activate
   ```

2. When adding new Python dependencies, use uv:
   ```bash
   uv pip install <package-name>
   ```

3. Update requirements.txt after adding new packages:
   ```bash
   uv pip freeze > requirements.txt
   ```

4. Write tests before implementing functionality (Test-Driven Development).

### Frontend Development

1. When adding new dependencies, use npm:
   ```bash
   npm install <package-name>
   ```

2. Follow the Next.js App Router conventions for routing.

3. Use shadcn/ui components for consistent UI elements.

4. Implement proper error handling using sonner for toast notifications.

### Testing

Run the test suites for both frontend and backend:

**Backend tests:**
```bash
cd todo-app-backend
source .venv/bin/activate
pytest
```

**Frontend tests:**
```bash
cd todo-app
npm test
```

### Documentation

1. Update README files when adding new features or making significant changes.
2. Use Context7 for all package/library documentation when researching dependencies.

## Troubleshooting

### Common Issues

1. **JWT Secret Mismatch**: Ensure the JWT_SECRET is identical in both frontend and backend environments.

2. **Database Connection Issues**: Verify your DATABASE_URL is correctly configured and accessible.

3. **Authentication Not Working**: Check that Better Auth is properly configured in the Next.js App Router.

4. **Dependency Issues**: Make sure you're using uv for Python dependencies and npm for frontend dependencies.

### Need Help?

Refer to the project's documentation in the `docs/` directory or reach out to the development team.