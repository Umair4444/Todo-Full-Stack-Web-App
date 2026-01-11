"""
Monitoring and observability setup for the Todo Backend API.

This module adds monitoring capabilities to track application performance,
health metrics, and system resources.
"""

import time
import psutil
import logging
from functools import wraps
from typing import Callable, Any
from pydantic import BaseModel
from fastapi import FastAPI, Depends, Request
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import asyncio


# Metrics definitions
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

CPU_USAGE = Gauge(
    'cpu_percent',
    'CPU usage percentage'
)

MEMORY_USAGE = Gauge(
    'memory_percent',
    'Memory usage percentage'
)

DB_CONNECTIONS = Gauge(
    'db_connections',
    'Number of database connections'
)


class HealthCheck(BaseModel):
    """Health check response model."""
    status: str
    timestamp: float
    response_time_ms: float
    details: dict


class MonitoringMiddleware:
    """Middleware to collect metrics for each request."""
    
    def __init__(self, app: FastAPI):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        start_time = time.time()
        status_code = None

        # Track active connections
        ACTIVE_CONNECTIONS.inc()

        async def send_wrapper(message):
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            # Record metrics after response is sent
            process_time = time.time() - start_time
            
            # Extract endpoint from scope
            endpoint = scope.get("path", "/unknown")
            method = scope.get("method", "UNKNOWN")
            
            # Update metrics
            REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status_code).inc()
            REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(process_time)
            
            # Decrement active connections
            ACTIVE_CONNECTIONS.dec()


def monitor_resources():
    """Monitor system resources periodically."""
    CPU_USAGE.set(psutil.cpu_percent(interval=1))
    MEMORY_USAGE.set(psutil.virtual_memory().percent)


def setup_monitoring(app: FastAPI):
    """Set up monitoring for the FastAPI application."""
    # Add middleware
    app.add_middleware(MonitoringMiddleware)
    
    # Add metrics endpoint
    @app.get("/metrics")
    async def get_metrics():
        """Endpoint to expose Prometheus metrics."""
        monitor_resources()
        return generate_latest()
    
    # Add enhanced health check
    @app.get("/healthz", response_model=HealthCheck)
    async def health_check():
        """Enhanced health check with detailed metrics."""
        start_time = time.time()

        try:
            # Perform health checks
            checks = {
                "database": "connected",  # This would check actual DB connectivity
                "api": "responsive",
                "disk_space": "ok",
                "memory": "ok"
            }
            
            # Check disk space
            disk_usage = psutil.disk_usage('/')
            if disk_usage.percent > 90:
                checks["disk_space"] = "warning"
                
            # Check memory usage
            memory_percent = psutil.virtual_memory().percent
            if memory_percent > 90:
                checks["memory"] = "warning"
            
            response_time = round((time.time() - start_time) * 1000, 2)
            
            return HealthCheck(
                status="healthy",
                timestamp=time.time(),
                response_time_ms=response_time,
                details=checks
            )
        except Exception as e:
            response_time = round((time.time() - start_time) * 1000, 2)
            return HealthCheck(
                status="unhealthy",
                timestamp=time.time(),
                response_time_ms=response_time,
                details={
                    "error": str(e),
                    "database": "disconnected"
                }
            ), 503


def log_api_call(func: Callable) -> Callable:
    """Decorator to log API calls with timing information."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        request: Request = kwargs.get('request') or (args[0] if args and hasattr(args[0], 'app') else None)
        
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            
            if request:
                logging.info(
                    f"API_CALL: {request.method} {request.url.path} "
                    f"STATUS: 200 DURATION: {duration:.3f}s"
                )
            
            return result
        except Exception as e:
            duration = time.time() - start_time
            
            if request:
                logging.error(
                    f"API_CALL: {request.method} {request.url.path} "
                    f"STATUS: 500 DURATION: {duration:.3f}s ERROR: {str(e)}"
                )
            
            raise
    
    return wrapper