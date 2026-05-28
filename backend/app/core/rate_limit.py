"""
Rate Limiting Middleware — In-Memory (dev) + Redis (production)

In development/SQLite mode: uses a simple in-memory TTL dict.
In production mode (REDIS_URL set): uses Redis for distributed counting.

No Redis required for local development.
"""

import time
from collections import defaultdict
from typing import Callable, Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


# ── In-Memory Rate Limiter ────────────────────────────────────────────────────

class _InMemoryStore:
    """Thread-safe enough for single-process dev usage."""
    def __init__(self):
        self._data: dict[str, tuple[int, float]] = defaultdict(lambda: (0, 0.0))

    def incr_with_window(self, key: str, window_seconds: int) -> tuple[int, float]:
        count, window_start = self._data[key]
        now = time.time()
        if now - window_start >= window_seconds:
            # New window
            count = 1
            window_start = now
        else:
            count += 1
        self._data[key] = (count, window_start)
        reset_at = window_start + window_seconds
        return count, reset_at


_store = _InMemoryStore()


class RateLimiter:
    """Unified rate limiter: in-memory for dev, Redis for production."""

    def __init__(self, redis_client=None):
        self.redis = redis_client

    async def is_allowed(
        self,
        key: str,
        limit: int,
        window_seconds: int = 60,
    ) -> tuple[bool, int, int]:
        """
        Returns (is_allowed, remaining, reset_time_epoch).
        """
        if self.redis is not None:
            return await self._redis_check(key, limit, window_seconds)
        return self._memory_check(key, limit, window_seconds)

    def _memory_check(
        self, key: str, limit: int, window_seconds: int
    ) -> tuple[bool, int, int]:
        count, reset_at = _store.incr_with_window(key, window_seconds)
        remaining = max(0, limit - count)
        return count <= limit, remaining, int(reset_at)

    async def _redis_check(
        self, key: str, limit: int, window_seconds: int
    ) -> tuple[bool, int, int]:
        import redis.asyncio as aioredis
        current_window = int(time.time() // window_seconds)
        redis_key = f"ratelimit:{key}:{current_window}"
        current = await self.redis.incr(redis_key)
        if current == 1:
            await self.redis.expire(redis_key, window_seconds)
        remaining = max(0, limit - current)
        reset_time = (current_window + 1) * window_seconds
        return current <= limit, remaining, reset_time


# ── Middleware ────────────────────────────────────────────────────────────────

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Transparent rate limiting middleware.
    Uses in-memory store in dev, Redis in production (when REDIS_URL is configured).
    """

    def __init__(self, app, redis_url: Optional[str] = None):
        super().__init__(app)
        self.redis_url = redis_url
        self._redis = None
        self._use_redis = bool(redis_url and redis_url != "redis://localhost:6379/0")

    async def get_limiter(self) -> RateLimiter:
        if self._use_redis and self._redis is None:
            try:
                import redis.asyncio as aioredis
                self._redis = aioredis.from_url(self.redis_url, decode_responses=True)
            except Exception:
                # Fallback to in-memory if Redis unavailable
                self._use_redis = False
        return RateLimiter(redis_client=self._redis if self._use_redis else None)

    def _get_limit_for_path(self, path: str) -> tuple[int, int]:
        if "/webhooks/" in path:
            return 10000, 60  # Effectively unlimited
        elif "/auth/" in path:
            return 5, 60
        elif "/availability" in path:
            return 500, 60
        else:
            return 100, 60

    def _get_client_key(self, request: Request) -> str:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            return f"user:{token[:20]}"
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        return f"ip:{ip}"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip rate limiting for internal/static paths
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        limiter = await self.get_limiter()
        client_key = self._get_client_key(request)
        limit, window = self._get_limit_for_path(request.url.path)

        is_allowed, remaining, reset_time = await limiter.is_allowed(
            f"{client_key}:{request.url.path}", limit, window
        )

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={
                    "Retry-After": str(reset_time - int(time.time())),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset_time),
                },
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(reset_time)
        return response
