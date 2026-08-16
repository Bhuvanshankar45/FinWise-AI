FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies required for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    libssl-dev \
    libffi-dev \
    pkg-config \
    gcc \
  && rm -rf /var/lib/apt/lists/*

# Upgrade pip tools for better package compatibility, then install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Expose the port (Render will provide $PORT at runtime)
EXPOSE 8000

# Copy start script and make it executable
COPY backend/start.sh /start.sh
RUN chmod +x /start.sh

# Use the start script as the container entrypoint (uses $PORT)
ENTRYPOINT ["/start.sh"]
