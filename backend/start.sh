#!/bin/sh

# Start script for FinWise AI backend
# Uses PORT env var provided by Render (defaults to 8000 if not set)
PORT=${PORT:-8000}

# Optional: Run DB migrations if alembic is configured (uncomment if using Alembic)
# cd /app && alembic upgrade head || true

exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
