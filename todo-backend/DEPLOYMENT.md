# Deployment Guide: Todo Backend API

## Overview

This document provides instructions for deploying the Todo Backend API to Hugging Face Spaces. The backend is built with FastAPI and uses Neon Serverless PostgreSQL as the database. The application is specifically designed to be deployed on Hugging Face Spaces.

## Prerequisites

- A Hugging Face account
- Git
- Access to PostgreSQL database (Neon Serverless recommended)
- A GitHub repository with your application code

## Deployment Option: Hugging Face Spaces (Only Supported Method)

This is the only supported deployment method for this application.

1. **Prepare your repository:**
   - Ensure all necessary files are in your repository:
     - `app.py` - Main application entry point
     - `Dockerfile` - Docker configuration
     - `requirements.txt` - Python dependencies
     - `space.yml` - Hugging Face Space configuration
     - All other source code files in the `src` directory

2. **Create a Hugging Face Space:**
   - Go to [Hugging Face Spaces](https://huggingface.co/new-space)
   - Fill in the space details:
     - Name: Choose a unique name for your space
     - License: MIT
     - SDK: Docker
     - Hardware: CPU (sufficient for this application)
     - Visibility: Public or Private as per your preference

3. **Connect your repository:**
   - In your space page, go to the "Files" tab
   - Click on "Edit Files" and select "Duplicate Space" to create a copy you can modify
   - Go to "Settings" → "Repository" → "Connect to GitHub"
   - Follow the prompts to connect your GitHub repository

4. **Configure environment variables:**
   - Go to the "Files" tab in your space
   - Click on "Environment Variables" (or "Secrets")
   - Add the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: Generate a strong secret key
     - `ALGORITHM`: HS256 (default)
     - `ACCESS_TOKEN_EXPIRE_MINUTES`: 30 (or your preferred value)
     - `ENVIRONMENT`: production
     - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `https://yourdomain.vercel.app,http://localhost:3000`)

5. **Monitor deployment:**
   - The space will automatically start building
   - Monitor the "Logs" tab to see the build and startup process
   - Once successful, your application will be available at:
     `https://[your-username]-[your-space-name].hf.space`

## Environment Variables

The following environment variables must be configured for the application to run:

- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@host:port/dbname`)
- `SECRET_KEY`: Secret key for JWT token signing
- `ALGORITHM`: Algorithm for JWT token encoding (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)
- `ENVIRONMENT`: Environment name (development, staging, production)
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (optional, defaults to allowing all origins)

## Post-Deployment Tasks

1. **Verify the deployment:**
   - Check the logs in the "Logs" tab of your Space
   - Test the API endpoints:
     ```bash
     curl https://[your-username]-[your-space-name].hf.space/health
     ```

2. **Configure monitoring:**
   - Set up log monitoring
   - Monitor the `/metrics` endpoint if using Prometheus

3. **Security considerations:**
   - Ensure sensitive data is not exposed
   - Use HTTPS for all communications
   - Regularly rotate your secret keys

## Troubleshooting

### Common Issues

1. **Application fails to start:**
   - Check the logs in the "Logs" tab of your Space
   - Verify environment variables are set correctly
   - Ensure database connection is working

2. **Database connection errors:**
   - Verify `DATABASE_URL` is correct
   - Check if your database provider allows connections from Hugging Face IPs
   - Ensure required database permissions are granted

3. **Hugging Face Spaces specific issues:**
   - Check the logs in the "Logs" tab of your Space
   - Verify environment variables are set in Space settings
   - Ensure your Dockerfile is properly configured for Spaces

### Performance Issues

- Monitor application performance with the health endpoint: `/health`
- Check the metrics endpoint: `/metrics` (if using monitoring)
- Review database query performance

## Maintenance

### Regular Maintenance Tasks

1. **Update dependencies:**
   - Update your requirements.txt file as needed
   - Redeploy to refresh dependencies

2. **Database maintenance:**
   - Regular backups (handled by your database provider)
   - Query performance monitoring

### Backup Strategy

1. **Application backup:**
   - Code and configuration files are stored in your GitHub repository

2. **Database backup:**
   - Regular automated backups (handled by your database provider)

## Monitoring and Observability

The application includes built-in monitoring capabilities:

- **Health endpoint**: `/health` - Check application and database status
- **Metrics endpoint**: `/metrics` - Prometheus-formatted metrics
- **Structured logging**: JSON-formatted logs with multiple log levels

For production deployments, consider setting up:
- Prometheus for metrics collection
- Grafana for visualization
- Alerting based on health and performance metrics