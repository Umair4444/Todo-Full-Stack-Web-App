# How-To: Deploy the Todo Backend

## Overview
This guide explains how to deploy the Todo Backend API to different environments, from local testing to production.

## Prerequisites

Before deploying, ensure you have:

- Access to a target environment (cloud platform, VPS, etc.)
- Proper credentials for the target environment
- A configured database (PostgreSQL)
- Domain name (for production deployments)
- SSL certificate (for production deployments)

## Deployment Options

### Option 1: Deploy to Cloud Platform (Railway)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize a new project:**
   ```bash
   railway init
   ```

4. **Set environment variables:**
   ```bash
   railway vars set DATABASE_URL=your_neon_db_url
   railway vars set SECRET_KEY=your_secret_key
   railway vars set ENVIRONMENT=production
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Open the deployed application:**
   ```bash
   railway open
   ```

### Option 2: Deploy to Heroku

1. **Install Heroku CLI:**
   Follow instructions at: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create a new app:**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set DATABASE_URL=your_neon_db_url
   heroku config:set SECRET_KEY=your_secret_key
   heroku config:set ENVIRONMENT=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Open the deployed application:**
   ```bash
   heroku open
   ```

### Option 3: Deploy to DigitalOcean App Platform

1. **Create a DigitalOcean account** and navigate to App Platform

2. **Connect your GitHub/GitLab account** to DigitalOcean

3. **Select your repository** containing the Todo Backend code

4. **Configure the deployment:**
   - Set environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: Your secret key
     - `ENVIRONMENT`: production
   - Set the run command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

5. **Deploy** by clicking the "Deploy" button

### Option 4: Deploy to AWS (EC2)

1. **Launch an EC2 instance** with Ubuntu 20.04 or later

2. **SSH into the instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Update the system and install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx git supervisor -y
   ```

4. **Clone your repository:**
   ```bash
   git clone <your-repo-url>
   cd todo-backend
   ```

5. **Set up the virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install uv
   uv pip install -r requirements.txt
   ```

6. **Configure environment variables:**
   ```bash
   nano .env  # Add your environment variables
   ```

7. **Set up the database:**
   ```bash
   python init_db.py
   ```

8. **Create a systemd service file:**
   ```bash
   sudo nano /etc/systemd/system/todo-backend.service
   ```
   
   Add the following content:
   ```
   [Unit]
   Description=Todo Backend API
   After=network.target

   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/todo-backend
   EnvironmentFile=/home/ubuntu/todo-backend/.env
   ExecStart=/home/ubuntu/todo-backend/venv/bin/uvicorn src.main:app --host 0.0.0.0 --port 8000
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

9. **Enable and start the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable todo-backend
   sudo systemctl start todo-backend
   ```

10. **Set up Nginx as a reverse proxy:**
    ```bash
    sudo nano /etc/nginx/sites-available/todo-backend
    ```
    
    Add the following content:
    ```
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
    }
    ```
    
    Enable the site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/todo-backend /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

11. **Set up SSL with Let's Encrypt (optional but recommended):**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your-domain.com
    ```

### Option 5: Deploy with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t todo-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name todo-backend \
     -p 8000:8000 \
     -e DATABASE_URL=your_db_url \
     -e SECRET_KEY=your_secret_key \
     -e ENVIRONMENT=production \
     todo-backend
   ```

## Configuration for Different Environments

### Environment Variables

Ensure these environment variables are set for each environment:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `ENVIRONMENT`: development, staging, or production
- `LOG_LEVEL`: DEBUG, INFO, WARNING, or ERROR
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts (for production)

### Database Configuration

For production deployments:

1. Use a managed PostgreSQL service (like Neon, AWS RDS, or Google Cloud SQL)
2. Ensure proper backup and recovery procedures are in place
3. Set up read replicas if expecting high traffic
4. Configure connection pooling appropriately

### Security Considerations

1. **Never commit secrets to version control**
2. **Use HTTPS in production**
3. **Restrict allowed hosts**
4. **Implement rate limiting**
5. **Keep dependencies updated**
6. **Monitor for vulnerabilities**

## Post-Deployment Tasks

### Verify Deployment

1. **Check if the service is running:**
   ```bash
   # For systemd services
   sudo systemctl status todo-backend
   
   # For Docker containers
   docker ps
   ```

2. **Test the API endpoints:**
   ```bash
   curl http://your-domain.com/health
   ```

3. **Check application logs:**
   ```bash
   # For systemd services
   sudo journalctl -u todo-backend -f
   
   # For Docker containers
   docker logs -f todo-backend
   ```

### Set Up Monitoring

1. **Configure log aggregation**
2. **Set up health checks**
3. **Implement performance monitoring**
4. **Set up alerting for critical issues**

### Set Up Backups

1. **Database backups**
2. **Configuration backups**
3. **Automated backup schedules**
4. **Test backup restoration procedures**

## Troubleshooting Common Deployment Issues

### Application Won't Start

1. Check logs for error messages
2. Verify environment variables are set correctly
3. Ensure the database is accessible
4. Check file permissions

### Database Connection Issues

1. Verify the database URL is correct
2. Check if the database server is running
3. Ensure the database user has proper permissions
4. Check network connectivity between app and database

### Performance Issues

1. Monitor resource usage (CPU, memory)
2. Check database query performance
3. Implement caching if needed
4. Consider scaling options

## Rolling Back a Deployment

If you need to roll back to a previous version:

### For Git-based deployments (Heroku, Railway, etc.)
1. Identify the previous commit that worked
2. Deploy that specific commit

### For Docker deployments
1. Tag your images with version numbers
2. Deploy the previous version tag

### For manual deployments
1. Keep backups of previous versions
2. Have a script to restore the previous version