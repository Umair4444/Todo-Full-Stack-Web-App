# How-To: Deploy the Todo Backend to Hugging Face Spaces

## Overview
This guide explains how to deploy the Todo Backend API to Hugging Face Spaces, which is the primary deployment target for this application.

## Prerequisites

Before deploying, ensure you have:

- A Hugging Face account
- A GitHub repository with your application code
- Access to a PostgreSQL database (Neon Serverless recommended)
- Basic familiarity with Docker and environment variables

## Deployment to Hugging Face Spaces

### Step 1: Prepare Your Repository

Make sure your repository contains all necessary files for the deployment:

- `app.py` - Main application entry point
- `Dockerfile` - Docker configuration
- `requirements.txt` - Python dependencies
- `space.yml` - Hugging Face Space configuration
- All other source code files in the `src` directory

### Step 2: Configure Your Space

Your repository already includes a `space.yml` file that specifies the Space configuration:

```yaml
title: Todo Backend API
emoji: ✅
color: "#BBD2FF"
sdk: docker
src: app.py
license: mit
hf_oauth: []
```

This configuration tells Hugging Face Spaces to:
- Use the Docker SDK
- Run the `app.py` file as the main application
- Apply the specified styling and metadata

### Step 3: Understand the Docker Configuration

Your `Dockerfile` is already properly configured for Hugging Face Spaces:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port (Hugging Face Spaces will set the PORT environment variable)
EXPOSE 8000

# Run the application
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

Key points:
- The application listens on port 8000
- It uses the `PORT` environment variable provided by Hugging Face Spaces
- All dependencies from `requirements.txt` are installed

### Step 4: Set Up Your External Database

Since Hugging Face Spaces have ephemeral storage, you must use an external database:

1. Choose a PostgreSQL provider (Neon is recommended for its serverless capabilities)
2. Create a new PostgreSQL database
3. Note your database connection string in the format:
   ```
   postgresql://username:password@host:port/database_name
   ```

### Step 5: Create Your Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/new-space)
2. Fill in the space details:
   - Name: Choose a unique name for your space
   - License: MIT (as specified in your space.yml)
   - SDK: Docker (as specified in your space.yml)
   - Hardware: Choose CPU for this application (GPU is not needed)
   - Visibility: Public or Private as per your preference
3. Click "Create Space"

### Step 6: Connect Your Repository

After creating the space:

1. In your space page, click on the "Files" tab
2. Click on "Edit Files" in the top-right corner
3. Select "Duplicate Space" to create a copy you can modify
4. In your duplicated space, go to the "Files" tab
5. Click on "Files" → "Add file" → "Upload files"
6. Upload all files from your todo-backend directory, or connect your GitHub repository:
   - Go to "Settings" → "Repository" → "Connect to GitHub"
   - Follow the prompts to connect your repository

### Step 7: Configure Environment Variables

After your files are uploaded:

1. Go to the "Files" tab in your space
2. Click on "Environment Variables" (or "Secrets" depending on the interface)
3. Add the following environment variables:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Generate a strong secret key (you can use Python to generate one: `python -c 'import secrets; print(secrets.token_urlsafe(32))'`)
   - `ALGORITHM`: HS256 (default)
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: 30 (or your preferred value)
   - `ENVIRONMENT`: production
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `https://yourdomain.vercel.app,http://localhost:3000`)

### Step 8: Wait for Deployment

After configuring everything:

1. The space will automatically start building
2. Monitor the "Logs" tab to see the build and startup process
3. Once the build completes successfully, your application will be available at:
   ```
   https://[your-username]-[your-space-name].hf.space
   ```

### Step 9: Verify Your Deployment

1. Visit your space URL to confirm the application is running
2. Test the API endpoints:
   - Health check: `https://[your-username]-[your-space-name].hf.space/health`
   - API docs: `https://[your-username]-[your-space-name].hf.space/docs`
   - ReDoc: `https://[your-username]-[your-space-name].hf.space/redoc`
3. Test the Todo API endpoints as needed

## Configuration for Production

### Environment Variables

Ensure these environment variables are set:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `ENVIRONMENT`: production
- `LOG_LEVEL`: INFO or ERROR for production
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### Database Configuration

For production deployments:

1. Use a managed PostgreSQL service (like Neon Serverless)
2. Ensure proper backup and recovery procedures are in place
3. Configure connection pooling appropriately

### Security Considerations

1. **Never commit secrets to version control**
2. **Use strong, randomly generated secret keys**
3. **Implement proper CORS settings with specific origins**
4. **Keep dependencies updated**
5. **Monitor for vulnerabilities**

## Post-Deployment Tasks

### Verify Deployment

1. **Check the application logs in the "Logs" tab of your Space**
2. **Test the API endpoints:**
   ```bash
   curl https://[your-username]-[your-space-name].hf.space/health
   ```

### Set Up Monitoring

1. **Configure log monitoring through Hugging Face Spaces interface**
2. **Set up health checks**
3. **Monitor the `/metrics` endpoint if using Prometheus**

## Troubleshooting Common Deployment Issues

### Application Won't Start

1. Check the logs in the "Logs" tab of your Space
2. Verify environment variables are set correctly
3. Ensure your database connection string is correct

### Database Connection Issues

1. Verify your PostgreSQL connection string
2. Check if your database provider allows connections from Hugging Face IPs
3. Ensure your database credentials are correct

### CORS Issues

1. Verify that `ALLOWED_ORIGINS` includes your frontend domain
2. Check that the domain format is correct (includes `https://`)

### Performance Issues

1. Monitor resource usage through Hugging Face Spaces interface
2. Check database query performance
3. Consider upgrading to a paid Space for better performance if needed