#!/bin/bash
# Deployment script for Todo Backend API

set -e  # Exit on any error

echo "Starting deployment of Todo Backend API..."

# Configuration
APP_NAME="todo-backend"
ENVIRONMENT=${1:-"production"}  # Default to production if no environment specified
DEPLOYMENT_DIR="/opt/$APP_NAME"
BACKUP_DIR="/opt/backups/$APP_NAME-$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[INFO]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   warn "Running as root. This is not recommended for production."
fi

# Create backup of current deployment
create_backup() {
    log "Creating backup of current deployment..."
    if [ -d "$DEPLOYMENT_DIR" ]; then
        mkdir -p "$(dirname "$BACKUP_DIR")"
        cp -r "$DEPLOYMENT_DIR" "$BACKUP_DIR"
        log "Backup created at $BACKUP_DIR"
    else
        log "No existing deployment to backup"
    fi
}

# Restore from backup
restore_backup() {
    if [ -d "$BACKUP_DIR" ]; then
        log "Restoring from backup..."
        rm -rf "$DEPLOYMENT_DIR"
        cp -r "$BACKUP_DIR" "$DEPLOYMENT_DIR"
        log "Backup restored"
        exit 1
    else
        error "No backup available to restore"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing system dependencies..."
    # For Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y python3 python3-pip python3-venv nginx supervisor postgresql-client
    # For CentOS/RHEL/Fedora
    elif command -v yum &> /dev/null; then
        sudo yum update -y
        sudo yum install -y python3 python3-pip python3-virtualenv nginx supervisor postgresql
    elif command -v dnf &> /dev/null; then
        sudo dnf update -y
        sudo dnf install -y python3 python3-pip python3-virtualenv nginx supervisor postgresql
    else
        warn "Could not detect package manager. Please install dependencies manually."
    fi
}

# Setup application directory
setup_app_dir() {
    log "Setting up application directory..."
    sudo mkdir -p "$DEPLOYMENT_DIR"
    sudo chown $USER:$USER "$DEPLOYMENT_DIR"
}

# Deploy application files
deploy_files() {
    log "Deploying application files..."
    # Copy application files (adjust path as needed)
    rsync -av --exclude '__pycache__' --exclude '.git' ./todo-backend/ "$DEPLOYMENT_DIR/"
    
    # Create virtual environment
    cd "$DEPLOYMENT_DIR"
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install uv
    uv pip install -r requirements.txt
    
    log "Application dependencies installed"
}

# Setup environment variables
setup_env() {
    log "Setting up environment variables..."
    if [ ! -f "$DEPLOYMENT_DIR/.env" ]; then
        warn "Environment file (.env) not found. Creating a template."
        cat << EOF > "$DEPLOYMENT_DIR/.env"
# Todo Backend Environment Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=$ENVIRONMENT
LOG_LEVEL=INFO
EOF
        warn "Please update $DEPLOYMENT_DIR/.env with your actual configuration values"
    fi
}

# Setup database
setup_database() {
    log "Setting up database..."
    cd "$DEPLOYMENT_DIR"
    source venv/bin/activate
    
    # Run database migrations
    python init_db.py
    
    log "Database setup completed"
}

# Setup systemd service
setup_systemd_service() {
    log "Setting up systemd service..."
    SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
    
    sudo tee "$SERVICE_FILE" > /dev/null << EOF
[Unit]
Description=Todo Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DEPLOYMENT_DIR
EnvironmentFile=$DEPLOYMENT_DIR/.env
ExecStart=$DEPLOYMENT_DIR/venv/bin/python $DEPLOYMENT_DIR/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable "$APP_NAME"
    log "Systemd service created and enabled"
}

# Setup nginx reverse proxy
setup_nginx() {
    log "Setting up nginx reverse proxy..."
    NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
    
    sudo tee "$NGINX_CONF" > /dev/null << EOF
server {
    listen 80;
    server_name localhost;  # Change this to your domain

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
}
EOF

    sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$APP_NAME"
    sudo nginx -t  # Test nginx configuration
    sudo systemctl reload nginx
    log "Nginx reverse proxy configured"
}

# Start the application
start_application() {
    log "Starting the application..."
    sudo systemctl restart "$APP_NAME"
    
    # Wait a moment for the service to start
    sleep 5
    
    # Check if the service is running
    if sudo systemctl is-active --quiet "$APP_NAME"; then
        log "Application started successfully"
    else
        error "Failed to start application"
        sudo systemctl status "$APP_NAME" --no-pager -l
        exit 1
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    sleep 10  # Give the app some time to fully start
    
    # Check if the service is running
    if sudo systemctl is-active --quiet "$APP_NAME"; then
        log "Service is active"
    else
        error "Service is not running"
        exit 1
    fi
    
    # Try to reach the health endpoint (if available)
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log "Health check passed"
    else
        warn "Health check endpoint not reachable, but service is running"
    fi
}

# Main deployment process
main() {
    log "Starting deployment process for environment: $ENVIRONMENT"
    
    create_backup
    install_dependencies
    setup_app_dir
    deploy_files
    setup_env
    setup_database
    setup_systemd_service
    setup_nginx
    start_application
    health_check
    
    log "Deployment completed successfully!"
    log "Application is running at http://localhost (proxied through nginx)"
    log "Service name: $APP_NAME"
    log "Deployment directory: $DEPLOYMENT_DIR"
}

# Handle script interruption
trap 'error "Deployment interrupted. Attempting to restore from backup..."; restore_backup' INT TERM

# Run main function
main "$@"