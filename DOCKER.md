# Docker Setup for Color-Agent Monorepo

This document provides instructions for containerizing and running the Color-Agent monorepo applications using Docker.

## Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

The Color-Agent monorepo contains the following applications:

-   **Backend API** (FastAPI in `apps/api`)
-   **Web Application** (Next.js in `apps/web`)
-   **Native Mobile App** (React Native in `apps/native`)
-   **Shared packages** (UI components, configs in `packages/`)

## Docker Configuration Files

-   `.dockerignore` - Specifies files to exclude from Docker build context
-   `apps/api/Dockerfile` - Multi-stage Dockerfile for the FastAPI backend
-   `apps/web/Dockerfile` - Multi-stage Dockerfile for the Next.js web application
-   `docker-compose.yml` - Configuration for local development environment

## Development Environment

To start the development environment:

```bash
docker compose up
```

This will start the following services:

-   PostgreSQL database on port 5432
-   Redis on port 6379
-   Backend API on port 8000
-   Web application on port 3000

For development with hot reloading, the source code directories are mounted as volumes.

### Helper Script

A helper script is provided to simplify common Docker operations:

```bash
# Make the script executable (first time only)
chmod +x docker-helpers.sh

# Show available commands
./docker-helpers.sh help

# Start all services
./docker-helpers.sh start

# View logs for a specific service
./docker-helpers.sh logs api

# Open a shell in a container
./docker-helpers.sh shell web
```

## Building Individual Applications

### Backend API

To build the backend API container:

```bash
docker build -f apps/api/Dockerfile -t coloragent-api .
```

To run the container:

```bash
docker run -p 8000:8000 coloragent-api
```

### Web Application

To build the web application container:

```bash
docker build -f apps/web/Dockerfile -t coloragent-web .
```

To run the container:

```bash
docker run -p 3000:3000 coloragent-web
```

## Production Deployment

For production deployment, build the containers with the appropriate environment variables:

```bash
# Backend API
docker build -f apps/api/Dockerfile -t coloragent-api:production .

# Web Application
docker build -f apps/web/Dockerfile -t coloragent-web:production .
```

### Using Turborepo Remote Caching

To leverage Turborepo's remote caching during Docker builds:

```bash
docker build -f apps/web/Dockerfile \
  --build-arg TURBO_TEAM="your-team-name" \
  --build-arg TURBO_TOKEN="your-token" \
  -t coloragent-web:production .
```

## Environment Variables

### Backend API

-   `DATABASE_URL` - PostgreSQL connection string
-   `REDIS_URL` - Redis connection string
-   `DEBUG` - Enable debug mode (true/false)
-   `JWT_SECRET` - Secret key for JWT authentication
-   `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)

### Web Application

-   `NODE_ENV` - Node.js environment (development/production)
-   `APP_BASE_URL` - Base URL for the web application
-   `API_URL` - URL for the backend API

## Troubleshooting

### Database Connection Issues

If the API service cannot connect to the database, ensure the database is running and the `DATABASE_URL` environment variable is correctly set.

### Volume Permissions

If you encounter permission issues with mounted volumes, you may need to adjust the permissions:

```bash
# For Linux/macOS
chmod -R 777 ./apps/api
chmod -R 777 ./apps/web
```

### Container Logs

To view logs for a specific service:

```bash
docker compose logs -f api
docker compose logs -f web
```

## CI/CD Integration

For CI/CD pipelines, you can use the Dockerfiles to build and deploy the applications. Example GitHub Actions workflow:

```yaml
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - name: Build API
              run: docker build -f apps/api/Dockerfile -t coloragent-api:${{ github.sha }} .
            - name: Build Web
              run: docker build -f apps/web/Dockerfile -t coloragent-web:${{ github.sha }} .
            # Add steps to push to container registry
```
