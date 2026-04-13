"""
AgentDesk FastAPI application entrypoint.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.core.config import get_settings
from app.core.database import engine, Base
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import agencies, businesses, calls, webhooks, billing, numbers
from app.models.agency import Agency

logger = structlog.get_logger()
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("AgentDesk API starting", env=settings.app_env)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    if settings.app_env == "development":
        async with AsyncSession(engine) as session:
            result = await session.execute(
                select(Agency).where(Agency.id == settings.dev_agency_id)
            )
            agency = result.scalar_one_or_none()
            if not agency:
                session.add(
                    Agency(
                        id=settings.dev_agency_id,
                        clerk_org_id=settings.dev_agency_id,
                        name=settings.dev_agency_name,
                        subdomain="local-demo",
                    )
                )
                await session.commit()
                logger.info("Bootstrapped local dev agency", agency_id=settings.dev_agency_id)
    yield
    # Shutdown
    await engine.dispose()
    logger.info("AgentDesk API stopped")


app = FastAPI(
    title="AgentDesk API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else ["https://agentdesk.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(agencies.router, prefix="/api/v1/agencies", tags=["agencies"])
app.include_router(businesses.router, prefix="/api/v1/businesses", tags=["businesses"])
app.include_router(calls.router, prefix="/api/v1/calls", tags=["calls"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["billing"])
app.include_router(numbers.router, prefix="/api/v1/numbers", tags=["numbers"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
