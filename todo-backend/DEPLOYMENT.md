# Deployment Guide: Todo Backend API

## Overview

This document provides instructions for deploying the Todo Backend API to production environments. The backend is built with FastAPI and uses Neon Serverless PostgreSQL as the database.

## Prerequisites

- Linux server (Ubuntu 20.04+ or CentOS 7+ recommended)
- Python 3.11 or higher
- Git
- Docker (optional, for containerized deployment)
- Access to Neon PostgreSQL database
- Domain name (optional, for production)

## Deployment Options

### Option 1: Direct Server Deployment (Recommended)

This approach deploys the application directly to a Linux server using systemd for process management.

#### Automated Deployment

Use the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh [environment]
# Example: ./deploy.sh production
```

#### Manual Deployment Steps

1. **Prepare the server:**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y  # For Ubuntu/Debian
   # OR
   sudo yum update -y  # For CentOS/RHEL
   
   # Install required packages
   sudo apt install python3 python3-pip python3-venv nginx supervisor postgresql-client -y
   ```

2. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todo-backend
   ```

3. **Set up virtual environment and install dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install uv
   uv pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   nano .env
   ```

5. **Set up the database:**
   ```bash
   # Run database migrations
   python init_db.py
   ```

6. **Set up systemd service:**
   Create `/etc/systemd/system/todo-backend.service`:
   ```ini
   [Unit]
   Description=Todo Backend API
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/todo-backend
   EnvironmentFile=/path/to/todo-backend/.env
   ExecStart=/path/to/todo-backend/venv/bin/python /path/to/todo-backend/main.py
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

7. **Start the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable todo-backend
   sudo systemctl start todo-backend
   ```

8. **Set up nginx reverse proxy:**
   Create `/etc/nginx/sites-available/todo-backend`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Security headers
       add_header X-Content-Type-Options nosniff;
       add_header X-Frame-Options DENY;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/todo-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Option 2: Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t todo-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name todo-backend \
     -p 8000:8000 \
     --env-file .env \
     todo-backend
   ```

### Option 3: Cloud Platform Deployment

#### Deploy to Railway

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway init
   ```

4. Deploy:
   ```bash
   railway up
   ```

#### Deploy to Heroku

1. Install the Heroku CLI:
   ```bash
   # Follow instructions at: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new app:
   ```bash
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=your_neon_db_url
   heroku config:set SECRET_KEY=your_secret_key
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

## Environment Variables

The following environment variables must be configured for the application to run:

- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@host:port/dbname`)
- `SECRET_KEY`: Secret key for JWT token signing
- `ALGORITHM`: Algorithm for JWT token encoding (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)
- `ENVIRONMENT`: Environment name (development, staging, production)
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

## Post-Deployment Tasks

1. **Verify the deployment:**
   ```bash
   # Check if the service is running
   sudo systemctl status todo-backend
   
   # Check application logs
   sudo journalctl -u todo-backend -f
   ```

2. **Set up SSL certificate (for production):**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain and install certificate
   sudo certbot --nginx -d your-domain.com
   ```

3. **Configure monitoring:**
   - Set up log rotation
   - Configure application monitoring
   - Set up health checks

4. **Security hardening:**
   - Configure firewall rules
   - Set up fail2ban for SSH protection
   - Regular security updates

## Rollback Procedure

If you need to rollback to a previous version:

1. **Using the deployment script:**
   ```bash
   # The script automatically creates backups before each deployment
   # To restore from the last backup, run:
   ./deploy.sh --restore
   ```

2. **Manual rollback:**
   ```bash
   # Stop the current service
   sudo systemctl stop todo-backend
   
   # Restore from backup
   sudo cp -r /opt/backups/todo-backend-previous /opt/todo-backend
   
   # Start the service
   sudo systemctl start todo-backend
   ```

## Troubleshooting

### Common Issues

1. **Application fails to start:**
   - Check logs: `sudo journalctl -u todo-backend -f`
   - Verify environment variables are set correctly
   - Ensure database connection is working

2. **Database connection errors:**
   - Verify `DATABASE_URL` is correct
   - Check if the database server is accessible
   - Ensure required database permissions are granted

3. **Nginx configuration errors:**
   - Test configuration: `sudo nginx -t`
   - Check error logs: `sudo tail -f /var/log/nginx/error.log`

### Performance Issues

- Monitor application performance with the health endpoint: `/health`
- Check system resources: `htop`, `df -h`
- Review database query performance
- Consider adding caching for frequently accessed data

## Maintenance

### Regular Maintenance Tasks

1. **Update dependencies:**
   ```bash
   # In the application directory
   source venv/bin/activate
   pip list --outdated
   # Update as needed
   ```

2. **Database maintenance:**
   - Regular backups
   - Index optimization
   - Query performance monitoring

3. **System maintenance:**
   - Regular OS updates
   - Log rotation
   - Security patches

### Backup Strategy

1. **Application backup:**
   - Code and configuration files
   - Environment variables

2. **Database backup:**
   - Regular automated backups
   - Off-site storage for critical data

3. **Test backup restoration:**
   - Regular testing of backup files
   - Document restoration procedures