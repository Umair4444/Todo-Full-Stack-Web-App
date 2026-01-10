"""
Data validation middleware to ensure data integrity
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Callable, Awaitable
import json

# Define validation rules for different endpoints
VALIDATION_RULES = {
    "/auth/register": {
        "required_fields": ["email", "password"],
        "field_validations": {
            "email": lambda x: "@" in x and "." in x and len(x) <= 254,
            "password": lambda x: len(x) >= 8,  # More complex validation would be needed in practice
            "name": lambda x: x is None or (isinstance(x, str) and len(x) <= 100)
        }
    },
    "/auth/login": {
        "required_fields": ["username", "password"],  # Using username for email
        "field_validations": {
            "username": lambda x: "@" in x and "." in x and len(x) <= 254,
            "password": lambda x: len(x) >= 1
        }
    },
    "/todos/": {
        "required_fields": ["title"],
        "field_validations": {
            "title": lambda x: isinstance(x, str) and 1 <= len(x) <= 100,
            "description": lambda x: x is None or (isinstance(x, str) and len(x) <= 500),
            "completed": lambda x: isinstance(x, bool),
            "priority": lambda x: x in ["low", "medium", "high"]
        }
    }
}


async def validate_request_data(request: Request):
    """
    Middleware to validate incoming request data based on predefined rules.
    """
    # Get the path and method
    path = request.url.path
    method = request.method
    
    # Skip validation for GET requests and certain paths
    if method == "GET" or path in ["/", "/health"]:
        return await request.app.router.handle(request)
    
    # Find the appropriate validation rule
    validation_rule = None
    for rule_path, rule in VALIDATION_RULES.items():
        if path.endswith(rule_path.rstrip('/')) or path.startswith(rule_path):
            validation_rule = rule
            break
    
    # If no validation rule is found, proceed without validation
    if not validation_rule:
        return await request.app.router.handle(request)
    
    # Read the request body
    try:
        body = await request.body()
        if body:
            data = json.loads(body.decode())
        else:
            data = {}
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON in request body"
        )
    
    # Validate required fields
    for field in validation_rule.get("required_fields", []):
        if field not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required field: {field}"
            )
    
    # Validate field values
    for field, validator in validation_rule.get("field_validations", {}).items():
        if field in data:
            try:
                if not validator(data[field]):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid value for field: {field}"
                    )
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid value for field: {field}"
                )
    
    # Add validated data to request state for use in route handlers
    request.state.validated_data = data
    
    # Continue with the request
    return await request.app.router.handle(request)


def add_data_validation_middleware(app):
    """
    Add data validation middleware to the FastAPI app.
    """
    @app.middleware("http")
    async def middleware_handler(request: Request, call_next: Callable[[Request], Awaitable[any]]):
        # Apply validation if it's a path that needs it
        path = request.url.path
        method = request.method
        
        if method in ["POST", "PUT", "PATCH"] and any(path.endswith(rule_path.rstrip('/')) or path.startswith(rule_path) for rule_path in VALIDATION_RULES.keys()):
            # Read and validate the request body
            try:
                body = await request.body()
                if body:
                    data = json.loads(body.decode())
                else:
                    data = {}
            except json.JSONDecodeError:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "Invalid JSON in request body"}
                )
            
            # Find the appropriate validation rule
            validation_rule = None
            for rule_path, rule in VALIDATION_RULES.items():
                if path.endswith(rule_path.rstrip('/')) or path.startswith(rule_path):
                    validation_rule = rule
                    break
            
            if validation_rule:
                # Validate required fields
                for field in validation_rule.get("required_fields", []):
                    if field not in data:
                        return JSONResponse(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            content={"detail": f"Missing required field: {field}"}
                        )
                
                # Validate field values
                for field, validator in validation_rule.get("field_validations", {}).items():
                    if field in data:
                        try:
                            if not validator(data[field]):
                                return JSONResponse(
                                    status_code=status.HTTP_400_BAD_REQUEST,
                                    content={"detail": f"Invalid value for field: {field}"}
                                )
                        except Exception:
                            return JSONResponse(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                content={"detail": f"Invalid value for field: {field}"}
                            )
        
        response = await call_next(request)
        return response