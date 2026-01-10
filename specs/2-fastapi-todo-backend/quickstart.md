# Quickstart Guide: FastAPI Todo Backend

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm
- uv package manager
- Access to Neon Serverless PostgreSQL

## Setup Instructions

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Set up Python virtual environment**
   ```bash
   uv venv
   ```

3. **Activate virtual environment**
   ```bash
   # On Linux/Mac:
   source .venv/bin/activate
   
   # On Windows:
   .venv\Scripts\activate
   ```

4. **Install Python dependencies**
   ```bash
   uv pip install -r requirements.txt
   ```

5. **Set up environment variables**
   Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL=your_neon_postgres_connection_string
   AUTH_SECRET=your_auth_secret_key
   ```

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the frontend directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## API Documentation

Once the backend is running, API documentation is available at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Available Scripts

### Backend
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests
- `alembic revision --autogenerate -m "message"` - Generate migration
- `alembic upgrade head` - Apply migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests

## Configuration Notes

- The backend runs on port 8000 by default
- The frontend runs on port 3000 by default
- All API requests from frontend are proxied through Next.js API routes
- Authentication tokens are stored in browser cookies