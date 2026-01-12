# Todo Backend API on Hugging Face Spaces

This is a FastAPI backend for managing todo items deployed on Hugging Face Spaces.

## Features

- RESTful API endpoints for todo management
- Create, read, update, and delete todo items
- Filtering and pagination support
- Health check endpoint
- Proper error handling
- Rate limiting (100 requests/hour per IP)

## Database Configuration

⚠️ **Important Note for Hugging Face Spaces Deployment:**

Hugging Face Spaces have ephemeral storage, which means any data stored locally will be lost when the space restarts. Therefore, you must use an external database service such as:

- [Neon Serverless PostgreSQL](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [AWS RDS](https://aws.amazon.com/rds/)
- [Google Cloud SQL](https://cloud.google.com/sql)

### Setting up External Database

1. Sign up for one of the database providers mentioned above
2. Create a new PostgreSQL database
3. In your Hugging Face Space settings, add the following environment variable:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://username:password@host:port/database_name`)

### Environment Variables

The following environment variables must be set in your Hugging Face Space settings:

- `DATABASE_URL`: PostgreSQL connection string for your external database
- `SECRET_KEY`: Secret key for JWT token signing (generate a random secret key)
- `ALGORITHM`: Algorithm for JWT token encoding (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)

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

## About Hugging Face Spaces

[Hugging Face Spaces](https://huggingface.co/spaces) are free, community-driven apps that let you deploy ML models and applications. This FastAPI backend is configured to run on Hugging Face Spaces infrastructure.

## License

MIT