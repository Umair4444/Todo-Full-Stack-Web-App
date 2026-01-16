import re
from fastapi import HTTPException, status
from typing import Dict, Any


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validates the strength of a password based on defined criteria.
    
    Args:
        password: The password string to validate
        
    Returns:
        Dictionary with validation result and any error messages
    """
    errors = []
    
    # Check minimum length
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    # Check for uppercase letter
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    # Check for lowercase letter
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    # Check for digit
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    # Check for special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors
    }


def validate_email_format(email: str) -> bool:
    """
    Validates the format of an email address.
    
    Args:
        email: The email string to validate
        
    Returns:
        Boolean indicating if the email format is valid
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_registration_data(email: str, password: str, first_name: str = None, last_name: str = None) -> Dict[str, Any]:
    """
    Validates registration data including email format and password strength.
    
    Args:
        email: Email address to validate
        password: Password to validate
        first_name: Optional first name to validate
        last_name: Optional last name to validate
        
    Returns:
        Dictionary with validation result and any error messages
    """
    errors = {}
    
    # Validate email
    if not email:
        errors["email"] = ["Email is required"]
    elif not validate_email_format(email):
        errors["email"] = ["Invalid email format"]
    
    # Validate password
    password_validation = validate_password_strength(password)
    if not password_validation["is_valid"]:
        errors["password"] = password_validation["errors"]
    
    # Validate first name if provided
    if first_name and len(first_name) > 100:
        errors["first_name"] = ["First name must not exceed 100 characters"]
    
    # Validate last name if provided
    if last_name and len(last_name) > 100:
        errors["last_name"] = ["Last name must not exceed 100 characters"]
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors
    }