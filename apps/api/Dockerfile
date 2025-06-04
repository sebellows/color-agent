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

COPY pyproject.toml uv.lock ./
# Install uv for faster Python package installation
RUN pip install uv
RUN uv sync

COPY alembic.ini .
COPY ./migrations ./migrations

COPY ./src ./src

# Copy package.json and requirements files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/apps/api/pyproject.toml ./apps/api/
COPY --from=builder /app/out/full/apps/api/uv.lock ./apps/api/

# Install Python dependencies
RUN cd apps/api && \
  uv pip install --system -r pyproject.toml && \
  if [ -f uv.lock ]; then uv pip install --system -r uv.lock; fi

# Stage 4: Final stage
FROM base AS final

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PORT=8000

# Copy application code
COPY --from=builder /app/out/full/ .

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
