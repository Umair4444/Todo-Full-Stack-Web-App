"""
Password validation utilities
"""

import re
from typing import List


def validate_password_strength(password: str) -> List[str]:
    """
    Validates the strength of a password based on various criteria.
    
    Returns a list of error messages for any failed criteria.
    An empty list indicates a strong password.
    """
    errors = []
    
    # Check minimum length
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    # Check for at least one uppercase letter
    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")
    
    # Check for at least one lowercase letter
    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")
    
    # Check for at least one digit
    if not re.search(r"\d", password):
        errors.append("Password must contain at least one digit")
    
    # Check for at least one special character
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
    
    return errors


def is_valid_password(password: str) -> bool:
    """
    Checks if a password meets all strength requirements.
    
    Returns True if the password is valid, False otherwise.
    """
    return len(validate_password_strength(password)) == 0