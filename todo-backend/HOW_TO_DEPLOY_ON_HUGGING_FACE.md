# How to Deploy Your FastAPI Todo Backend on Hugging Face Spaces

This guide will walk you through deploying your FastAPI Todo Backend application on Hugging Face Spaces using Docker.

## Prerequisites

Before you begin, ensure you have:

1. A [Hugging Face account](https://huggingface.co/join)
2. An external PostgreSQL database (since Hugging Face Spaces have ephemeral storage):
   - [Neon Serverless PostgreSQL](https://neon.tech/) (recommended)
   - [Supabase](https://supabase.com/)
   - [AWS RDS](https://aws.amazon.com/rds/)
   - [Google Cloud SQL](https://cloud.google.com/sql)
3. Your application code pushed to a GitHub repository
4. Basic familiarity with Docker and environment variables

## Step-by-Step Deployment Guide

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

## Important Notes

### Database Considerations
- Remember that Hugging Face Spaces have ephemeral storage
- Any data stored locally will be lost when the space restarts
- Always use an external PostgreSQL database for persistence
- Monitor your database connection limits as Hugging Face Spaces have shared resources

### Performance Considerations
- Free Spaces may go to sleep when inactive
- Paid Spaces offer better performance and uptime
- Monitor your application's resource usage

### Security Considerations
- Never commit secrets to your repository
- Use environment variables for sensitive information
- Consider restricting CORS settings in production
- Implement proper authentication for sensitive endpoints

## Troubleshooting

### Common Issues

1. **Application fails to start:**
   - Check the logs in the "Logs" tab
   - Verify environment variables are set correctly
   - Ensure your database connection string is correct

2. **Database connection errors:**
   - Verify your PostgreSQL connection string
   - Check if your database provider allows connections from Hugging Face IPs
   - Ensure your database credentials are correct

3. **Build failures:**
   - Check the build logs in the "Logs" tab
   - Verify all dependencies in requirements.txt are available
   - Ensure your Dockerfile is properly formatted

### Getting Help

- Check the Hugging Face documentation: https://huggingface.co/docs/hub/spaces
- Review the FastAPI documentation: https://fastapi.tiangolo.com/
- Look at the logs in your Space for specific error messages
- Join the Hugging Face Discord community for support

## Updating Your Deployment

To update your application after the initial deployment:

1. Push changes to your connected GitHub repository
2. Or directly edit files in the Hugging Face Spaces editor
3. The space will automatically rebuild with your changes
4. Monitor the logs to ensure the update was successful

## Scaling Considerations

As your application grows:

- Consider upgrading to a paid Space for better performance
- Monitor your database usage and scale accordingly
- Implement caching mechanisms if needed
- Consider using a CDN for static assets if you add any