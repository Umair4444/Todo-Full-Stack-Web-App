"""
Comprehensive input validation and sanitization
"""

import re
from typing import Any, Dict, List, Union
from pydantic import BaseModel, validator, ValidationError
from html import escape
import bleach


class InputValidator:
    """Class to handle comprehensive input validation and sanitization"""
    
    # Regex patterns for validation
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_-]{3,20}$')
    PASSWORD_PATTERN = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
    PHONE_PATTERN = re.compile(r'^\+?[1-9]\d{1,14}$')  # E.164 format
    URL_PATTERN = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    @staticmethod
    def sanitize_html(content: str) -> str:
        """Sanitize HTML content to prevent XSS"""
        # Allow only safe HTML tags and attributes
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        allowed_attributes = {
            'a': ['href', 'title'],
            '*': ['class']
        }
        
        return bleach.clean(content, tags=allowed_tags, attributes=allowed_attributes, strip=True)
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        return bool(InputValidator.EMAIL_PATTERN.match(email))
    
    @staticmethod
    def validate_username(username: str) -> bool:
        """Validate username format"""
        return bool(InputValidator.USERNAME_PATTERN.match(username))
    
    @staticmethod
    def validate_password(password: str) -> bool:
        """Validate password strength"""
        return bool(InputValidator.PASSWORD_PATTERN.match(password))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        return bool(InputValidator.PHONE_PATTERN.match(phone))
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate URL format"""
        return bool(InputValidator.URL_PATTERN.match(url))
    
    @staticmethod
    def validate_length(value: str, min_len: int = 0, max_len: int = None) -> bool:
        """Validate string length"""
        if max_len is None:
            return len(value) >= min_len
        return min_len <= len(value) <= max_len
    
    @staticmethod
    def validate_not_empty(value: Any) -> bool:
        """Validate that value is not empty"""
        if value is None:
            return False
        if isinstance(value, str):
            return len(value.strip()) > 0
        if isinstance(value, (list, tuple, dict)):
            return len(value) > 0
        return True
    
    @staticmethod
    def validate_enum(value: str, allowed_values: List[str]) -> bool:
        """Validate that value is in allowed list"""
        return value in allowed_values
    
    @staticmethod
    def validate_uuid(uuid_str: str) -> bool:
        """Validate UUID format"""
        import uuid
        try:
            uuid.UUID(uuid_str)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def sanitize_input(input_value: str, max_length: int = 1000) -> str:
        """Sanitize input to prevent injection attacks"""
        if input_value is None:
            return None
        
        # Limit length
        if len(input_value) > max_length:
            input_value = input_value[:max_length]
        
        # Escape HTML
        input_value = escape(input_value)
        
        # Remove potentially dangerous characters
        dangerous_chars = ['<', '>', '"', "'", '&', ';', '#', '{', '}', '%', '`', '|']
        for char in dangerous_chars:
            input_value = input_value.replace(char, '')
        
        return input_value
    
    @staticmethod
    def validate_json(json_str: str) -> bool:
        """Validate JSON string"""
        import json
        try:
            json.loads(json_str)
            return True
        except ValueError:
            return False


class TodoItemValidator(BaseModel):
    """Validator for Todo items"""
    title: str
    description: str = None
    completed: bool = False
    priority: str  # Will be validated in the validator
    
    @validator('title')
    def validate_title(cls, v):
        if not InputValidator.validate_not_empty(v):
            raise ValueError('Title cannot be empty')
        if not InputValidator.validate_length(v, min_len=1, max_len=100):
            raise ValueError('Title must be between 1 and 100 characters')
        # Sanitize title
        return InputValidator.sanitize_input(v, max_length=100)
    
    @validator('description')
    def validate_description(cls, v):
        if v is not None:
            if not InputValidator.validate_length(v, max_len=500):
                raise ValueError('Description must be less than 500 characters')
            # Sanitize description
            return InputValidator.sanitize_html(v)
        return v
    
    @validator('priority')
    def validate_priority(cls, v):
        allowed_priorities = ['low', 'medium', 'high']
        if v not in allowed_priorities:
            raise ValueError(f'Priority must be one of {allowed_priorities}')
        return v


class UserValidator(BaseModel):
    """Validator for User data"""
    email: str
    password: str
    name: str = None
    
    @validator('email')
    def validate_email(cls, v):
        if not InputValidator.validate_email(v):
            raise ValueError('Invalid email format')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if not InputValidator.validate_password(v):
            raise ValueError('Password must be at least 8 characters with uppercase, lowercase, number and special character')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if not InputValidator.validate_length(v, max_len=100):
                raise ValueError('Name must be less than 100 characters')
            # Sanitize name
            return InputValidator.sanitize_input(v, max_length=100)
        return v


def validate_and_sanitize_todo_data(todo_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize todo data"""
    try:
        validated_todo = TodoItemValidator(**todo_data)
        return validated_todo.dict()
    except ValidationError as e:
        raise ValueError(f"Validation error: {e}")


def validate_and_sanitize_user_data(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize user data"""
    try:
        validated_user = UserValidator(**user_data)
        return validated_user.dict()
    except ValidationError as e:
        raise ValueError(f"Validation error: {e}")