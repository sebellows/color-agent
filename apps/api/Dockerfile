# Stage 1: Base image
FROM python:3.13-slim AS base

# Set working directory
WORKDIR /app

# Stage 2: Builder stage for pruning the monorepo
FROM base AS builder

# Install Node.js and npm for running turbo
RUN apt-get update && apt-get install -y \
  curl \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install turbo globally
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include the API app and its dependencies
RUN turbo prune api --docker

# Stage 3: Install Python dependencies
FROM base AS python-deps

# Install system dependencies required for Python packages
RUN apt-get update && apt-get install -y \
  gcc \
  python3-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install uv for faster Python package installation
RUN pip install uv

# Copy package.json and requirements files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/apps/api/requirements*.txt ./apps/api/

# Install Python dependencies
RUN cd apps/api && \
  uv pip install --system -r requirements.txt && \
  if [ -f requirements-dev.txt ]; then uv pip install --system -r requirements-dev.txt; fi

# Stage 4: Final stage
FROM base AS final

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PORT=8000

# Create a non-root user to run the application
RUN adduser --disabled-password --gecos "" appuser

# Copy Python dependencies
COPY --from=python-deps /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=python-deps /usr/local/bin /usr/local/bin

# Copy application code
COPY --from=builder /app/out/full/ .

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "apps.api.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
