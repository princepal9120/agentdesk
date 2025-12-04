"""
Redis Cache Client
TRS Reference: Section 2.1 - Redis for caching and sessions
"""

import redis.asyncio as redis
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def get_redis() -> redis.Redis:
    """Dependency for getting Redis client."""
    return redis_client
