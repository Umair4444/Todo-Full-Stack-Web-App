# src/core/logging.py - Logging configuration

import logging
from fastapi import FastAPI


def setup_logging(app: FastAPI):
    """Configure logging for the application."""
    # Set up basic logging configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Get the logger for our application
    logger = logging.getLogger("todo_backend")
    
    # Add a handler if needed
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
    return logger