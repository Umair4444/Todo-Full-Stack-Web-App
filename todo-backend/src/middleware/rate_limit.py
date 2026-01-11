import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException
from typing import Dict


class RateLimiter:
    def __init__(self, max_requests: int = 1000, window_seconds: int = 3600):  # 1000 requests per hour
        self.max_requests = max_requests
        self.window_seconds = window_seconds
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


# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=1000, window_seconds=3600)  # 1000 requests per hour


async def rate_limit_middleware(request: Request, call_next):
    # Use client's IP address as the identifier
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded: 1000 requests per hour")
    
    response = await call_next(request)
    return response