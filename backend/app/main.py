"""
FastAPI Main Application
TRS Reference: Section 2.1 - Backend Requirements
PRD Reference: Section 3 - Solution Overview
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, appointments, webhooks, notifications, doctors, patients
from app.routers.appointments import availability_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup and shutdown."""
    # Startup
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="HIPAA-compliant AI voice agent for doctor appointment management",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware (TRS 2.5)
from app.core.rate_limit import RateLimitMiddleware
app.add_middleware(RateLimitMiddleware, redis_url=settings.REDIS_URL)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(appointments.router, prefix=settings.API_V1_PREFIX)
app.include_router(availability_router, prefix=settings.API_V1_PREFIX)
app.include_router(notifications.router, prefix=settings.API_V1_PREFIX)
app.include_router(doctors.router, prefix=settings.API_V1_PREFIX)
app.include_router(patients.router, prefix=settings.API_V1_PREFIX)
app.include_router(webhooks.router, prefix=settings.API_V1_PREFIX)
from app.routers import livekit
app.include_router(livekit.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Healthcare Voice Agent API",
        "version": settings.APP_VERSION,
        "docs": "/docs" if settings.DEBUG else "Disabled in production"
    }
