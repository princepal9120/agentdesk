"""
Rate Limiting Middleware
TRS Reference: Section 2.5 - API Rate Limiting
PRD Reference: NFR-4 - Rate limiting: 100 requests/minute per user

Uses Redis for counter storage with fixed window counters.
"""

import time
from typing import Optional, Callable
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import redis.asyncio as redis

from app.core.config import settings


class RateLimiter:
    """Redis-based rate limiter with fixed window counters."""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    async def is_allowed(
        self,
        key: str,
        limit: int,
        window_seconds: int = 60
    ) -> tuple[bool, int, int]:
        """
        Check if request is allowed within rate limit.
        
        Args:
            key: Unique identifier (user_id, IP, etc.)
            limit: Maximum requests allowed
            window_seconds: Time window in seconds
        
        Returns:
            Tuple of (is_allowed, remaining, reset_time)
        """
        current_window = int(time.time() // window_seconds)
        redis_key = f"ratelimit:{key}:{current_window}"
        
        # Increment counter
        current = await self.redis.incr(redis_key)
        
        # Set expiry on first request
        if current == 1:
            await self.redis.expire(redis_key, window_seconds)
        
        remaining = max(0, limit - current)
        reset_time = (current_window + 1) * window_seconds
        
        return current <= limit, remaining, reset_time


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for rate limiting.
    TRS 2.5: Different limits for different endpoint types.
    """
    
    def __init__(self, app, redis_url: str):
        super().__init__(app)
        self.redis_url = redis_url
        self._redis: Optional[redis.Redis] = None
    
    async def get_redis(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(self.redis_url, decode_responses=True)
        return self._redis
    
    def get_limit_for_path(self, path: str) -> tuple[int, int]:
        """
        Get rate limit based on path.
        TRS 2.5:
        - Auth endpoints: 5/min
        - Appointments: 100/min
        - Availability: 500/min
        - Webhooks: Unlimited
        """
        if "/webhooks/" in path:
            return 10000, 60  # Effectively unlimited
        elif "/auth/" in path:
            return settings.RATE_LIMIT_AUTH_PER_MINUTE, 60
        elif "/availability" in path:
            return settings.RATE_LIMIT_AVAILABILITY_PER_MINUTE, 60
        else:
            return settings.RATE_LIMIT_APPOINTMENTS_PER_MINUTE, 60
    
    def get_client_key(self, request: Request) -> str:
        """Get unique client identifier."""
        # Try to get user from auth header
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            # Use token hash as key (first 20 chars)
            token = auth_header[7:]
            return f"user:{token[:20]}"
        
        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        
        return f"ip:{ip}"
    
    async def dispatch(
        self,
        request: Request,
        call_next: Callable
    ) -> Response:
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        redis_client = await self.get_redis()
        limiter = RateLimiter(redis_client)
        
        client_key = self.get_client_key(request)
        limit, window = self.get_limit_for_path(request.url.path)
        
        is_allowed, remaining, reset_time = await limiter.is_allowed(
            f"{client_key}:{request.url.path}",
            limit,
            window
        )
        
        if not is_allowed:
            # TRS 2.5: Return 429 with Retry-After header
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={
                    "Retry-After": str(reset_time - int(time.time())),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset_time)
                }
            )
        
        response = await call_next(request)
        
        # Add rate limit headers to response
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(reset_time)
        
        return response


def create_rate_limit_dependency(
    limit: int,
    window_seconds: int = 60
):
    """
    Create a rate limit dependency for specific routes.
    
    Usage:
        @router.post("/login", dependencies=[Depends(create_rate_limit_dependency(5, 60))])
    """
    async def rate_limit_check(request: Request):
        from app.core.redis import redis_client
        
        limiter = RateLimiter(redis_client)
        client_key = request.client.host if request.client else "unknown"
        
        is_allowed, remaining, reset_time = await limiter.is_allowed(
            f"{client_key}:{request.url.path}",
            limit,
            window_seconds
        )
        
        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(reset_time - int(time.time()))}
            )
    
    return rate_limit_check
