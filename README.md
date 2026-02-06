# Todo Full-Stack Web Application

A modern, full-stack todo application built with Next.js (TypeScript) for the frontend and FastAPI (Python) for the backend. This application provides a complete solution for managing tasks with user authentication, responsive design, and advanced features like bulk operations, activity logging, and AI-powered chat assistance.

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui
- **Responsive Design**: Works seamlessly across all device sizes with mobile-first approach
- **User Authentication**: Secure registration and login with Better Auth and JWT tokens
- **Dark/Light Mode**: Toggle between light and dark themes
- **Multilingual Support**: Available in English and Urdu
- **Floating Navbar**: Glass effect navbar that hides on scroll down and appears on scroll up
- **AI-Powered Assistant**: Get help and support through the integrated AI agent available on all pages
- **Enhanced Task Management**:
  - Create, read, update, and delete todo items
  - Intuitive and responsive completion toggles with visual feedback
  - Bulk operations to select and delete multiple todo items at once
  - Filtering & sorting by status (active/completed) and priority (low/medium/high)
  - Activity logs to track and view history of todo actions
- **Animations**: Smooth animations and transitions using Framer Motion
- **Persistent Storage**: Todos and preferences are saved in localStorage

### Backend Features
- **RESTful API**: Well-documented endpoints for todo management
- **Authentication**: JWT-based authentication with secure session management
- **Database**: Neon Serverless PostgreSQL with SQLModel ORM
- **Rate Limiting**: 100 requests/hour per IP address
- **Health Checks**: Endpoints to verify service availability
- **Monitoring**: Prometheus metrics and observability
- **Error Handling**: Structured error responses with appropriate HTTP status codes
- **Bulk Operations**: Support for bulk deletion of todo items
- **Activity Logging**: Track create, update, and delete actions per user
- **AI Agent Integration**: OpenAI Agents SDK with LiteLLM extension for multi-provider LLM support including Google Gemini Pro
- **Chat History**: Persistent storage of user queries, agent responses, and performed tasks
- **Agent Tools**: Specialized tools for performing todo operations through the agent

## 🛠 Tech Stack

### Frontend
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

### Backend
- **Framework**: FastAPI (0.115.0)
- **ORM**: SQLModel (0.0.22)
- **Database**: Neon Serverless PostgreSQL
- **Server**: Uvicorn (0.32.0)
- **Validation**: Pydantic (2.9.2)
- **Migration Tool**: Alembic (1.13.2)
- **Testing**: pytest with FastAPI test client
- **AI Agents**: openai-agents for OpenAI Agents SDK with LiteLLM extension for multi-provider LLM support

## 📁 Project Structure

```
Todo-Full-Stack-Web-App/
├── todo-app/                 # Next.js frontend application
│   ├── public/
│   │   ├── locales/         # Translation files for i18n
│   │   │   ├── en/         # English translations
│   │   │   └── ur/         # Urdu translations
│   │   └── images/          # Static images
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Shared utilities and configurations
│   │   ├── services/        # API services and utilities
│   │   └── styles/          # Global styles
│   ├── __tests__/           # Unit and integration tests
│   ├── tests/               # E2E tests
│   ├── .env.example         # Environment variables example
│   ├── components.json      # Component library configuration
│   ├── next.config.ts       # Next.js configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── package.json
│   └── README.md
├── todo-app-backend/         # FastAPI backend application
│   ├── src/
│   │   ├── agents/          # AI agent implementation
│   │   │   ├── chat_agent.py
│   │   │   ├── todo_tools.py
│   │   │   └── tools_base.py
│   │   ├── api/             # API routers
│   │   │   ├── auth_router.py
│   │   │   ├── chat_router.py
│   │   │   ├── health_router.py
│   │   │   ├── response_format.py
│   │   │   ├── todo_log_router.py
│   │   │   ├── todo_router.py
│   │   │   └── todo_router_new.py
│   │   ├── config/          # Configuration settings
│   │   │   ├── litellm_config.py
│   │   │   └── settings.py
│   │   ├── database/        # Database configuration
│   │   │   └── database.py
│   │   ├── middleware/      # Application middleware
│   │   │   ├── agent_auth_middleware.py
│   │   │   ├── auth_middleware.py
│   │   │   └── rate_limit.py
│   │   ├── models/          # Database models
│   │   │   ├── chat_history_model.py
│   │   │   ├── todo_log_model.py
│   │   │   ├── todo_model.py
│   │   │   └── user_model.py
│   │   ├── routing/         # Routing utilities
│   │   │   └── no_slash_redirect_route.py
│   │   ├── services/        # Business logic and services
│   │   │   ├── auth_service.py
│   │   │   ├── chat_history_service.py
│   │   │   ├── chat_service.py
│   │   │   ├── todo_log_service.py
│   │   │   ├── todo_service.py
│   │   │   └── todo_service_functions.py
│   │   ├── utils/           # Utility functions
│   │   │   ├── jwt_utils.py
│   │   │   └── validation_utils.py
│   │   ├── api_client.py    # API client utilities
│   │   ├── exception_handlers.py # Global exception handlers
│   │   ├── main.py          # Application entry point
│   │   └── monitoring.py    # Application monitoring
│   ├── tests/               # Backend tests
│   ├── docs/                # API documentation
│   ├── scripts/             # Utility scripts
│   ├── alembic/             # Database migrations
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment variables example
│   ├── app.py               # Alternative application entry point
│   ├── Dockerfile           # Docker configuration
│   ├── main.py              # Main application entry point
│   ├── pyproject.toml       # Project metadata and dependencies
│   ├── requirements.txt     # Production dependencies
│   ├── requirements-dev.txt # Development dependencies
│   ├── alembic.ini          # Alembic configuration
│   └── README.md
├── specs/                   # Feature specifications
├── how-to/                  # How-to guides
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore rules
├── chatkit_docs.md         # ChatKit documentation
├── IMPLEMENTATION_SUMMARY.md # Implementation summary
├── openai_agents_google_models_docs.md # OpenAI agents documentation
├── QWEN.md                 # Qwen code documentation
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18.x or higher)
- npm (version 8.x or higher)
- Python 3.11+
- uv (for Python dependency management)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Todo App
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the frontend application.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd todo-app-backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   uv pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
   export SECRET_KEY="your-super-secret-key-here"
   ```

5. Run the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

6. The backend API will be available at [http://localhost:8000](http://localhost:8000)

### Environment Variables

#### Frontend
- `NEXT_PUBLIC_API_URL`: The URL of the backend API server
- `NEXT_PUBLIC_APP_NAME`: The name of the application (displayed in the UI)

#### Backend
- `DATABASE_URL`: PostgreSQL connection string for your database
- `SECRET_KEY`: Secret key for JWT token signing
- `ALGORITHM`: Algorithm for JWT token encoding (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)
- `ENVIRONMENT`: Environment name (development, staging, production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## 🧪 Testing

### Frontend Tests
Run frontend tests with:
```bash
npm run test
```

### Backend Tests
Run backend tests with:
```bash
pytest
```

## 📊 API Endpoints

### Frontend-Backend Communication
The frontend connects to these backend endpoints:

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/logout` - Logout user (invalidate session)

#### Todo Management
- `GET /api/todos` - Retrieve all todos for authenticated user
- `POST /api/todos` - Create a new todo for authenticated user
- `GET /api/todos/{id}` - Get a specific todo for authenticated user
- `PUT /api/todos/{id}` - Update a specific todo for authenticated user
- `DELETE /api/todos/{id}` - Delete a specific todo for authenticated user
- `POST /api/todos/bulk-delete` - Delete multiple todo items by ID
- `PATCH /api/todos/{id}/toggle-completion` - Toggle completion status of a todo item

#### Activity Logs
- `GET /api/todos/logs` - Get activity logs for authenticated user

#### AI Agent & Chat
- `POST /api/chat/session` - Initiate new chat session with AI agent
- `POST /api/chat/session/{session_id}/message` - Send message to chat session
- `GET /api/chat/history` - Retrieve chat history for authenticated user

#### Health Check
- `GET /health` - Check backend health status

#### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

#### Metrics
- `GET /metrics` - Prometheus metrics endpoint

## 🌐 Internationalization

The application supports both English and Urdu. Translation files are located in:
- English: `todo-app/public/locales/en/common.json`
- Urdu: `todo-app/public/locales/ur/common.json`

## 🚢 Deployment

### Frontend Deployment
The Next.js frontend can be deployed to:
- Vercel (recommended for Next.js apps)
- Netlify
- AWS Amplify
- Any hosting platform that supports static site hosting

### Backend Deployment
The FastAPI backend can be deployed to:
- Railway
- Heroku
- AWS EC2
- Google Cloud Run
- Any platform supporting Docker deployments
- Hugging Face Spaces (for the backend API)

### AI Agent Configuration
When deploying the backend, ensure you configure the AI agent properly:
- Set up your LLM provider credentials (OpenAI, Google Gemini, etc.)
- Configure the LiteLLM proxy if using multiple providers
- Ensure the agent tools are properly connected to your database

For detailed deployment instructions, refer to the individual README files in each project directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the excellent React framework
- [FastAPI](https://fastapi.tiangolo.com/) for the modern, fast web framework
- [shadcn/ui](https://ui.shadcn.com/) for the accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) for the lightweight state management
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
- [Better Auth](https://better-auth.com/) for the authentication solution
- [SQLModel](https://sqlmodel.tiangolo.com/) for the SQL databases with Python
- [Neon](https://neon.tech/) for the Serverless PostgreSQL solution
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) for the multi-agent framework
- [LiteLLM](https://litellm.ai/) for multi-provider LLM support
- [Umair4444](https://github.com/Umair4444) - My GitHub profile