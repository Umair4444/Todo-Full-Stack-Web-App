"""
Audit logging for security events
"""

import json
from datetime import datetime
from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel
import logging
import sys


class AuditEventType(str, Enum):
    USER_LOGIN = "USER_LOGIN"
    USER_LOGOUT = "USER_LOGOUT"
    USER_REGISTRATION = "USER_REGISTRATION"
    FAILED_LOGIN = "FAILED_LOGIN"
    PASSWORD_RESET = "PASSWORD_RESET"
    PERMISSION_DENIED = "PERMISSION_DENIED"
    DATA_ACCESS = "DATA_ACCESS"
    DATA_MODIFICATION = "DATA_MODIFICATION"
    SESSION_CREATED = "SESSION_CREATED"
    SESSION_DESTROYED = "SESSION_DESTROYED"
    TOKEN_ISSUED = "TOKEN_ISSUED"
    TOKEN_REVOKED = "TOKEN_REVOKED"


class AuditLogEntry(BaseModel):
    timestamp: datetime
    event_type: AuditEventType
    user_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    resource: Optional[str] = None
    action: Optional[str] = None
    success: bool = True
    details: Dict[str, Any] = {}


class AuditLogger:
    def __init__(self, log_file: str = "audit.log"):
        self.logger = logging.getLogger("AuditLogger")
        self.logger.setLevel(logging.INFO)
        
        # Prevent duplicate handlers
        if not self.logger.handlers:
            # Create file handler for audit logs
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(logging.INFO)
            
            # Create formatter for audit logs
            formatter = logging.Formatter('%(message)s')
            file_handler.setFormatter(formatter)
            
            # Add handler to logger
            self.logger.addHandler(file_handler)
    
    def log_event(
        self,
        event_type: AuditEventType,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        resource: Optional[str] = None,
        action: Optional[str] = None,
        success: bool = True,
        details: Dict[str, Any] = None
    ):
        """Log an audit event"""
        audit_entry = AuditLogEntry(
            timestamp=datetime.utcnow(),
            event_type=event_type,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            resource=resource,
            action=action,
            success=success,
            details=details or {}
        )
        
        # Serialize to JSON and log
        log_message = json.dumps({
            "timestamp": audit_entry.timestamp.isoformat(),
            "event_type": audit_entry.event_type,
            "user_id": audit_entry.user_id,
            "ip_address": audit_entry.ip_address,
            "user_agent": audit_entry.user_agent,
            "resource": audit_entry.resource,
            "action": audit_entry.action,
            "success": audit_entry.success,
            "details": audit_entry.details
        })
        
        self.logger.info(log_message)
    
    def log_user_login(self, user_id: str, ip_address: str, user_agent: str, success: bool = True, details: Dict[str, Any] = None):
        """Log user login event"""
        self.log_event(
            event_type=AuditEventType.USER_LOGIN,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            details=details
        )
    
    def log_user_logout(self, user_id: str, ip_address: str, details: Dict[str, Any] = None):
        """Log user logout event"""
        self.log_event(
            event_type=AuditEventType.USER_LOGOUT,
            user_id=user_id,
            ip_address=ip_address,
            details=details
        )
    
    def log_failed_login(self, email: str, ip_address: str, user_agent: str, reason: str = ""):
        """Log failed login attempt"""
        self.log_event(
            event_type=AuditEventType.FAILED_LOGIN,
            ip_address=ip_address,
            user_agent=user_agent,
            success=False,
            details={
                "email": email,
                "reason": reason
            }
        )
    
    def log_user_registration(self, user_id: str, ip_address: str, user_agent: str):
        """Log user registration event"""
        self.log_event(
            event_type=AuditEventType.USER_REGISTRATION,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    def log_permission_denied(self, user_id: str, resource: str, action: str, ip_address: str):
        """Log permission denied event"""
        self.log_event(
            event_type=AuditEventType.PERMISSION_DENIED,
            user_id=user_id,
            resource=resource,
            action=action,
            ip_address=ip_address
        )
    
    def log_data_access(self, user_id: str, resource: str, ip_address: str, success: bool = True):
        """Log data access event"""
        self.log_event(
            event_type=AuditEventType.DATA_ACCESS,
            user_id=user_id,
            resource=resource,
            ip_address=ip_address,
            success=success
        )
    
    def log_data_modification(self, user_id: str, resource: str, action: str, ip_address: str, success: bool = True):
        """Log data modification event"""
        self.log_event(
            event_type=AuditEventType.DATA_MODIFICATION,
            user_id=user_id,
            resource=resource,
            action=action,
            ip_address=ip_address,
            success=success
        )


# Global audit logger instance
audit_logger = AuditLogger()