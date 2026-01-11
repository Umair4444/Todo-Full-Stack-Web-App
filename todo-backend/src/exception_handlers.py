from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Union
from pydantic import ValidationError
from sqlmodel import SQLModel


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom handler for HTTP exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "HTTPException",
                "message": exc.detail,
                "path": str(request.url),
                "method": request.method
            }
        }
    )


async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Custom handler for validation exceptions.
    """
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "ValidationError",
                "message": "Validation failed",
                "details": exc.errors(),
                "path": str(request.url),
                "method": request.method
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Custom handler for general exceptions.
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "InternalServerError",
                "message": "An internal server error occurred",
                "path": str(request.url),
                "method": request.method
            }
        }
    )