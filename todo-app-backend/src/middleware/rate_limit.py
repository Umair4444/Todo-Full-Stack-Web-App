import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException
from typing import Dict
from src.config.settings import settings


class RateLimiter:
    def __init__(self, max_requests: int = None, window_seconds: int = None):
        self.max_requests = max_requests if max_requests is not None else settings.RATE_LIMIT_MAX_REQUESTS
        self.window_seconds = window_seconds if window_seconds is not None else settings.RATE_LIMIT_WINDOW_SECONDS
        self.requests: Dict[str, deque] = defaultdict(deque)

    def is_allowed(self, identifier: str) -> bool:
        now = time.time()
        # Clean old requests outside the window
        while (self.requests[identifier] and
               now - self.requests[identifier][0] > self.window_seconds):
            self.requests[identifier].popleft()

        # Check if the limit is exceeded
        if len(self.requests[identifier]) >= self.max_requests:
            return False

        # Add the current request
        self.requests[identifier].append(now)
        return True


# Global rate limiter instance using settings
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    # Use client's IP address as the identifier
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded: {settings.RATE_LIMIT_MAX_REQUESTS} requests per {settings.RATE_LIMIT_WINDOW_SECONDS} seconds"
        )

    response = await call_next(request)
    return response