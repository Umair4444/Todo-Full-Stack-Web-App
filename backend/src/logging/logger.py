"""
Comprehensive logging for all operations
"""

import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional
from enum import Enum
from fastapi import Request
from pydantic import BaseModel


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LogEvent(BaseModel):
    timestamp: datetime
    level: LogLevel
    module: str
    operation: str
    user_id: Optional[str] = None
    request_id: Optional[str] = None
    details: Dict[str, Any]


class Logger:
    def __init__(self, name: str = "TodoAppLogger"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        
        # Prevent duplicate handlers
        if not self.logger.handlers:
            # Create console handler
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(logging.DEBUG)
            
            # Create file handler
            file_handler = logging.FileHandler("todo_app.log")
            file_handler.setLevel(logging.DEBUG)
            
            # Create formatter
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            console_handler.setFormatter(formatter)
            file_handler.setFormatter(formatter)
            
            # Add handlers to logger
            self.logger.addHandler(console_handler)
            self.logger.addHandler(file_handler)
    
    def _log(self, level: LogLevel, module: str, operation: str, details: Dict[str, Any], 
             user_id: Optional[str] = None, request_id: Optional[str] = None):
        log_event = LogEvent(
            timestamp=datetime.utcnow(),
            level=level,
            module=module,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            details=details
        )
        
        message = f"[{log_event.module}] {log_event.operation} - {log_event.details}"
        
        if level == LogLevel.DEBUG:
            self.logger.debug(message)
        elif level == LogLevel.INFO:
            self.logger.info(message)
        elif level == LogLevel.WARNING:
            self.logger.warning(message)
        elif level == LogLevel.ERROR:
            self.logger.error(message)
        elif level == LogLevel.CRITICAL:
            self.logger.critical(message)
    
    def log_debug(self, module: str, operation: str, details: Dict[str, Any], 
                  user_id: Optional[str] = None, request_id: Optional[str] = None):
        self._log(LogLevel.DEBUG, module, operation, details, user_id, request_id)
    
    def log_info(self, module: str, operation: str, details: Dict[str, Any], 
                 user_id: Optional[str] = None, request_id: Optional[str] = None):
        self._log(LogLevel.INFO, module, operation, details, user_id, request_id)
    
    def log_warning(self, module: str, operation: str, details: Dict[str, Any], 
                    user_id: Optional[str] = None, request_id: Optional[str] = None):
        self._log(LogLevel.WARNING, module, operation, details, user_id, request_id)
    
    def log_error(self, module: str, operation: str, details: Dict[str, Any], 
                  user_id: Optional[str] = None, request_id: Optional[str] = None):
        self._log(LogLevel.ERROR, module, operation, details, user_id, request_id)
    
    def log_critical(self, module: str, operation: str, details: Dict[str, Any], 
                     user_id: Optional[str] = None, request_id: Optional[str] = None):
        self._log(LogLevel.CRITICAL, module, operation, details, user_id, request_id)


# Global logger instance
app_logger = Logger()


def log_api_call(request: Request, response_status: int, execution_time: float):
    """Log API call details"""
    app_logger.log_info(
        module="API",
        operation=f"{request.method} {request.url.path}",
        details={
            "status_code": response_status,
            "execution_time_ms": execution_time,
            "user_agent": request.headers.get("user-agent"),
            "ip_address": request.client.host if request.client else "unknown"
        },
        request_id=request.headers.get("x-request-id")
    )


def log_database_operation(operation: str, table: str, records_count: int = 1, success: bool = True):
    """Log database operations"""
    app_logger.log_info(
        module="DATABASE",
        operation=operation,
        details={
            "table": table,
            "records_count": records_count,
            "success": success
        }
    )


def log_authentication_event(event_type: str, user_id: str, success: bool, details: Dict[str, Any] = None):
    """Log authentication events"""
    app_logger.log_info(
        module="AUTHENTICATION",
        operation=event_type,
        user_id=user_id,
        details={
            "success": success,
            **(details or {})
        }
    )


def log_security_event(event_type: str, user_id: str, ip_address: str, details: Dict[str, Any] = None):
    """Log security events"""
    app_logger.log_warning(
        module="SECURITY",
        operation=event_type,
        user_id=user_id,
        details={
            "ip_address": ip_address,
            **(details or {})
        }
    )


def log_performance_metric(metric_name: str, value: float, unit: str = "", details: Dict[str, Any] = None):
    """Log performance metrics"""
    app_logger.log_info(
        module="PERFORMANCE",
        operation=metric_name,
        details={
            "value": value,
            "unit": unit,
            **(details or {})
        }
    )