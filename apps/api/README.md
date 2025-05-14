# ColorAgent API

Backend API for the ColorAgent application built with FastAPI.

## Features

- Async-first development
- Type safety with Pydantic
- Dependency injection
- SOLID principles
- Structured logging with structlog
- PostgreSQL database with SQLAlchemy
- Redis for caching and task queues
- Celery for background tasks

## Development

### Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Run the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

4. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Project Structure

```
apps/api/
├── src/                # Source code
│   ├── __init__.py     # Package initialization
│   ├── main.py         # FastAPI application
│   ├── models/         # Database models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── api/            # API routes
│   ├── core/           # Core functionality
│   └── utils/          # Utility functions
├── tests/              # Tests
├── pyproject.toml      # Project configuration
└── README.md           # This file
```

## Testing

Run tests with pytest:

```bash
pytest
```

## Logging

This project uses structlog for structured logging. Log levels:

- DEBUG: Diagnostic information
- INFO: Standard log level for normal operations
- WARN: Unexpected events that don't prevent functionality
- ERROR: Issues preventing functionality
