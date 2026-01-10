"""
Rate limiting for API endpoints
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
import time
import hashlib


class RateLimiter:
    def __init__(self):
        # Dictionary to store request counts per identifier
        self.requests: Dict[str, list] = defaultdict(list)
        # Default rate limit: 100 requests per minute per IP
        self.default_limit = 100
        self.default_window = 60  # seconds

    def is_allowed(self, identifier: str, limit: int = None, window: int = None) -> Tuple[bool, int, int]:
        """
        Check if a request is allowed based on rate limits.
        
        Args:
            identifier: Unique identifier for the client (e.g., IP address)
            limit: Max requests allowed per window (default: 100)
            window: Time window in seconds (default: 60)
            
        Returns:
            Tuple of (allowed, remaining_requests, reset_time_seconds)
        """
        if limit is None:
            limit = self.default_limit
        if window is None:
            window = self.default_window

        now = time.time()
        # Clean old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier] 
            if now - req_time < window
        ]

        current_requests = len(self.requests[identifier])

        if current_requests >= limit:
            # Rate limit exceeded
            oldest_request = min(self.requests[identifier])
            reset_time = int(oldest_request + window)
            return False, 0, reset_time - int(now)

        # Add current request
        self.requests[identifier].append(now)

        remaining = limit - current_requests - 1
        reset_time = int(now + window)
        
        return True, remaining, reset_time - int(now)


# Global rate limiter instance
rate_limiter = RateLimiter()


def get_client_identifier(request: Request) -> str:
    """
    Get a unique identifier for the client.
    This combines the IP address with the user ID if available.
    """
    # Get IP address from various headers (in case of proxies)
    forwarded_for = request.headers.get("x-forwarded-for")
    real_ip = request.headers.get("x-real-ip")
    x_cluster_client_ip = request.headers.get("x-cluster-client-ip")
    
    ip = (
        forwarded_for.split(",")[0].strip() if forwarded_for else
        real_ip if real_ip else
        x_cluster_client_ip if x_cluster_client_ip else
        request.client.host if request.client else
        "unknown"
    )
    
    # If we have a user token, include user ID in the identifier
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        # Extract user info from token (simplified - in real app, decode JWT)
        token = auth_header[7:]  # Remove "Bearer " prefix
        # For demo purposes, we'll hash the token to get a user ID
        user_id = hashlib.sha256(token.encode()).hexdigest()[:16]
        return f"{ip}:{user_id}"
    
    return ip


async def rate_limit_middleware(request: Request, call_next):
    """
    Middleware to enforce rate limiting.
    """
    identifier = get_client_identifier(request)
    
    # Define different limits for different endpoints
    path = request.url.path
    limit, window = 100, 60  # Default: 100 requests per minute
    
    # Apply stricter limits to authentication endpoints
    if path.startswith("/auth"):
        limit, window = 10, 60  # 10 requests per minute
    # Apply moderate limits to todo endpoints
    elif path.startswith("/todos"):
        limit, window = 50, 60  # 50 requests per minute
    
    allowed, remaining, reset_time = rate_limiter.is_allowed(identifier, limit, window)
    
    # Add rate limit headers to response
    response = await call_next(request)
    
    response.headers["X-RateLimit-Limit"] = str(limit)
    response.headers["X-RateLimit-Remaining"] = str(max(0, remaining))
    response.headers["X-RateLimit-Reset"] = str(reset_time)
    
    if not allowed:
        # Rate limit exceeded
        response = JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "detail": f"Rate limit exceeded. Try again in {reset_time} seconds.",
                "retry_after": reset_time
            }
        )
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = "0"
        response.headers["X-RateLimit-Reset"] = str(reset_time)
        response.headers["Retry-After"] = str(reset_time)
    
    return response