"""
Unit tests for password validation middleware in backend
"""
import pytest
from fastapi import HTTPException
from src.utils.validation_utils import validate_password_strength, validate_email_format, validate_registration_data


def test_validate_password_strength_strong_password():
    """Test that a strong password passes validation"""
    strong_password = "SecurePass123!"
    
    result = validate_password_strength(strong_password)
    
    assert result["is_valid"] is True
    assert len(result["errors"]) == 0


def test_validate_password_strength_too_short():
    """Test that a password that's too short fails validation"""
    weak_password = "Short1!"  # Only 7 chars, needs at least 8
    
    result = validate_password_strength(weak_password)
    
    assert result["is_valid"] is False
    assert "Password must be at least 8 characters long" in result["errors"]


def test_validate_password_strength_no_uppercase():
    """Test that a password without uppercase fails validation"""
    weak_password = "alllowercase1!"  # No uppercase
    
    result = validate_password_strength(weak_password)
    
    assert result["is_valid"] is False
    assert "Password must contain at least one uppercase letter" in result["errors"]


def test_validate_password_strength_no_lowercase():
    """Test that a password without lowercase fails validation"""
    weak_password = "ALLUPPERCASE1!"  # No lowercase
    
    result = validate_password_strength(weak_password)
    
    assert result["is_valid"] is False
    assert "Password must contain at least one lowercase letter" in result["errors"]


def test_validate_password_strength_no_number():
    """Test that a password without a number fails validation"""
    weak_password = "NoNumbers!"  # No numbers
    
    result = validate_password_strength(weak_password)
    
    assert result["is_valid"] is False
    assert "Password must contain at least one number" in result["errors"]


def test_validate_password_strength_no_special_char():
    """Test that a password without special character fails validation"""
    weak_password = "NoSpecialChar1"  # No special character
    
    result = validate_password_strength(weak_password)
    
    assert result["is_valid"] is False
    assert "Password must contain at least one special character" in result["errors"]


def test_validate_password_strength_empty():
    """Test that an empty password fails validation"""
    empty_password = ""
    
    result = validate_password_strength(empty_password)
    
    assert result["is_valid"] is False
    assert "Password must be at least 8 characters long" in result["errors"]


def test_validate_email_format_valid():
    """Test that valid email formats pass validation"""
    valid_emails = [
        "user@example.com",
        "test.email+tag@domain.co.uk",
        "user123@test-domain.org",
        "firstname.lastname@company.com"
    ]
    
    for email in valid_emails:
        is_valid = validate_email_format(email)
        assert is_valid is True, f"Email {email} should be valid"


def test_validate_email_format_invalid():
    """Test that invalid email formats fail validation"""
    invalid_emails = [
        "invalid-email",
        "@example.com",
        "user@",
        "user@.com",
        "user name@example.com",
        "user@domain",
        ""  # Empty string
    ]
    
    for email in invalid_emails:
        is_valid = validate_email_format(email)
        assert is_valid is False, f"Email {email} should be invalid"


def test_validate_registration_data_valid():
    """Test that valid registration data passes validation"""
    result = validate_registration_data(
        email="valid@example.com",
        password="SecurePass123!",
        first_name="John",
        last_name="Doe"
    )
    
    assert result["is_valid"] is True
    assert len(result["errors"]) == 0


def test_validate_registration_data_invalid_email():
    """Test that invalid email fails registration validation"""
    result = validate_registration_data(
        email="invalid-email",
        password="SecurePass123!",
        first_name="John",
        last_name="Doe"
    )
    
    assert result["is_valid"] is False
    assert "email" in result["errors"]
    assert "Invalid email format" in result["errors"]["email"]


def test_validate_registration_data_weak_password():
    """Test that weak password fails registration validation"""
    result = validate_registration_data(
        email="valid@example.com",
        password="weak",  # Too short and doesn't meet requirements
        first_name="John",
        last_name="Doe"
    )
    
    assert result["is_valid"] is False
    assert "password" in result["errors"]
    # Should have multiple password errors
    assert len(result["errors"]["password"]) >= 1


def test_validate_registration_data_missing_email():
    """Test that missing email fails registration validation"""
    result = validate_registration_data(
        email="",  # Empty email
        password="SecurePass123!",
        first_name="John",
        last_name="Doe"
    )
    
    assert result["is_valid"] is False
    assert "email" in result["errors"]
    assert "Email is required" in result["errors"]["email"]


def test_validate_registration_data_long_first_name():
    """Test that overly long first name fails validation"""
    result = validate_registration_data(
        email="valid@example.com",
        password="SecurePass123!",
        first_name="A" * 101,  # Exceeds 100 char limit
        last_name="Doe"
    )
    
    assert result["is_valid"] is False
    assert "first_name" in result["errors"]
    assert "First name must not exceed 100 characters" in result["errors"]["first_name"]


def test_validate_registration_data_long_last_name():
    """Test that overly long last name fails validation"""
    result = validate_registration_data(
        email="valid@example.com",
        password="SecurePass123!",
        first_name="John",
        last_name="A" * 101  # Exceeds 100 char limit
    )
    
    assert result["is_valid"] is False
    assert "last_name" in result["errors"]
    assert "Last name must not exceed 100 characters" in result["errors"]["last_name"]


def test_validate_registration_data_optional_names():
    """Test that registration works with optional names not provided"""
    result = validate_registration_data(
        email="valid@example.com",
        password="SecurePass123!"
        # first_name and last_name are optional
    )
    
    assert result["is_valid"] is True
    assert len(result["errors"]) == 0