#!/usr/bin/env python3
"""
Server startup script with full logging configuration
"""

import logging
import sys
from src.logging_config import setup_logging
from main import app
import uvicorn


def main():
    # Setup logging before anything else
    setup_logging()
    
    # Set the root logger to DEBUG to capture all messages
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    
    # Also set uvicorn loggers to INFO level
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    print("Starting server with full logging...", file=sys.stderr)
    
    # Run the server with logging
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug",  # This ensures all logs are shown
        access_log=True
    )


if __name__ == "__main__":
    main()