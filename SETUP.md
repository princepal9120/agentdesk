# Backend Setup Guide

This guide provides a step-by-step roadmap to set up and run the HealthVoice backend.

## 1. Prerequisites

Ensure you have the following installed:
- **Python 3.11+**
- **Docker & Docker Compose**
- **PostgreSQL Client** (optional, for debugging)
- **Redis CLI** (optional, for debugging)

## 2. Infrastructure Setup

Start the required infrastructure services (PostgreSQL, Redis, LiveKit) using Docker Compose.

```bash
cd backend
docker-compose up -d postgres redis livekit
```

> **Note**: If you encounter a "port already allocated" error, check if another service (like a local Postgres instance) is using port 5432. You may need to stop it or change the port mapping in `docker-compose.yml`.

## 3. Python Environment Setup

Create and activate a virtual environment to isolate dependencies.

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

## 4. Install Dependencies

Install the project dependencies, including development tools.

```bash
pip install -e ".[dev]"
```

## 5. Configuration

Set up the environment variables.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and configure the following (if needed):
    - `DATABASE_URL`: Defaults to `postgresql+asyncpg://postgres:postgres@localhost:5432/voice_agent`
    - `REDIS_URL`: Defaults to `redis://localhost:6379/0`
    - **API Keys** (Required for Voice Agent):
        - `OPENAI_API_KEY`
        - `DEEPGRAM_API_KEY`
        - `CARTESIA_API_KEY`

## 6. Database Migration

Apply the database schema using Alembic.

```bash
alembic upgrade head
```

## 7. Run the Application

Start the FastAPI backend server.

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
- **Swagger UI**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

## 8. Run Background Workers (Optional)

If you need to process background tasks (e.g., notifications):

```bash
# In a new terminal, activate venv and run:
celery -A app.core.celery_app worker --loglevel=info
```

## 9. Run Voice Agent (Optional)

To start the voice agent for handling calls:

```bash
# In a new terminal, activate venv and run:
python run_agent.py dev
```

## Troubleshooting

- **Port Conflicts**: Ensure ports 5432 (Postgres), 6379 (Redis), and 8000 (API) are free.
- **Database Connection**: Check if Docker containers are running (`docker ps`).
- **Missing Dependencies**: Re-run `pip install -e ".[dev]"`.
