"""
Main application module for the Todo Backend.
This file serves as an alias to the main application instance for testing purposes.
"""
import sys
import os
from pathlib import Path

# Add the parent directory to the path so we can import from the root
sys.path.append(str(Path(__file__).parent.parent))

# Import the app instance from the main application file
try:
    # Try importing from app.py first (used in deployments)
    from app import app
except ImportError:
    # Fallback to main.py (development)
    from main import app

# Make the app available at the module level
__all__ = ["app"]