import redis.asyncio as aioredis
from app.core.config import get_settings
from functools import lru_cache

settings = get_settings()


@lru_cache
def get_redis_client() -> aioredis.Redis:
    return aioredis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )


async def get_redis() -> aioredis.Redis:
    return get_redis_client()
