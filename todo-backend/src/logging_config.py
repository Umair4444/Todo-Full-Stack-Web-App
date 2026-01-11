import logging
import sys
from logging import config
from src.config.settings import settings


def setup_logging():
    """Configure logging for the application."""
    log_config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'default': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            },
            'detailed': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s',
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'default',
                'stream': sys.stdout,
            },
            'file': {
                'class': 'logging.FileHandler',
                'level': 'INFO',
                'formatter': 'detailed',
                'filename': 'app.log',
            },
        },
        'root': {
            'level': 'INFO',
            'handlers': ['console', 'file'],
        },
        'loggers': {
            'uvicorn': {
                'level': 'INFO',
                'handlers': ['console', 'file'],
                'propagate': False,
            },
            'uvicorn.error': {
                'level': 'INFO',
                'handlers': ['console', 'file'],
                'propagate': False,
            },
            'uvicorn.access': {
                'level': 'INFO',
                'handlers': ['console', 'file'],
                'propagate': False,
            },
        },
    }

    config.dictConfig(log_config)


# Initialize logging
setup_logging()

# Get logger for this module
logger = logging.getLogger(__name__)