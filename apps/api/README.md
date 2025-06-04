# ColorAgent API

This is the backend API for the ColorAgent application, which provides data on vendors of acrylic paint products.

## Features

-   RESTful API built with FastAPI
-   PostgreSQL database with SQLAlchemy ORM
-   Async database operations with asyncpg
-   Pydantic for data validation
-   Structured logging with structlog
-   Redis for caching and task queues
-   Celery for background tasks

## Project Structure

```
api/
├── src/
│   ├── api/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── decorators.py
│   │   │   ├── enums.py
│   │   │   ├── logger.py
│   │   │   ├── models.py
│   │   │   └── security.py
│   │   ├── domain/
│   │   │   ├── __init__.py
│   │   │   ├── analogous/
│   │   │   ├── color_range/
│   │   │   ├── health/
│   │   │   ├── locale/
│   │   │   ├── product/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── dependencies.py
│   │   │   │   ├── models.py
│   │   │   │   ├── repository.py
│   │   │   │   ├── routes.py
│   │   │   │   ├── models.py
│   │   │   │   └── schemas.py
│   │   │   ├── product_line/
│   │   │   ├── product_swatch/
│   │   │   ├── product_type/
│   │   │   ├── product_variant/
│   │   │   ├── tag/
│   │   │   ├── user/
│   │   │   ├── vendor/
│   │   │   └── associations.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── address.py
│   │   │   ├── auth.py
│   │   │   ├── base.py
│   │   │   ├── mixins.py
│   │   │   └── pagination.py
│   │   ├── scripts/
│   │   │   ├── __init__.py
│   │   │   └── import_data.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── queue.py
│   │   ├── types/
│   │   │   ├── __init__.py
│   │   │   └── datetime_utc.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── color.py
│   │   │   ├── lang.py
│   │   │   ├── path.py
│   │   │   ├── reducers.py
│   │   │   ├── string.py
│   │   │   └── terminal.py
│   │   ├── __init__.py
│   │   ├── routers.py
│   │   └── main.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── package.json
├── pyproject.toml
├── uv.lock
└── README.md
```

**NOTE:** In order to for the Python virtual environment to correctly parse import paths, the nested `api/` directory inside of `src/` is required in order to infer a parent module. Otherwise you wind up with an error like the following when trying to run a file or the application:

```bash
(.venv)  ✘  color-agent/apps/api   main±  /Users/seanbellows/Projects/color-agent/apps/api/.venv/bin/python /Users/seanbellows/Projects/color-agent/apps/api/src/import_data.py
Traceback (most recent call last):
  File "/Users/seanbellows/Projects/color-agent/apps/api/src/import_data.py", line 12, in <module>
    from src.core import get_logger, settings, setup_logging
ModuleNotFoundError: No module named 'src'
```

## Getting Started

### Prerequisites

-   Python 3.13+
-   PostgreSQL
-   Redis (optional, for caching and task queues)

### Installation

1. Clone the repository
2. Install dependencies using uv:

#### Using npm/pnpm scripts:

```bash
cd apps/api
# On Unix-like systems:
npm run setup       # Create venv and install dependencies
npm run setup:dev   # Install development dependencies

# On Windows:
npm run setup:win       # Create venv and install dependencies
npm run setup:dev:win   # Install development dependencies
```

#### Or manually:

```bash
cd apps/api
# Create a Python 3.13 virtual environment using uv
uv venv -p python3.13 .venv

# Activate the virtual environment
# On Unix-like systems:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install dependencies using uv
uv pip sync requirements.txt
# For development dependencies:
# uv pip sync requirements.txt requirements-dev.txt
```

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb coloragent
```

2. Create database tables:

```bash
python -m api.scripts.create_tables
```

3. Import sample data:

```bash
python -m api.scripts.import_data
```

### Running the API

```bash
python -m api.scripts.run_app
```

The API will be available at http://localhost:8000.

## API Documentation

Once the API is running, you can access the interactive API documentation at:

-   Swagger UI: http://localhost:8000/docs
-   ReDoc: http://localhost:8000/redoc

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```

### Type Checking

```bash
mypy .
```

## Package Management with uv

This project uses [uv](https://github.com/astral-sh/uv) for Python package management, which offers faster dependency resolution and installation compared to pip.

### Adding Dependencies

To add a new dependency:

```bash
# Add a production dependency
npm run deps:add -- package-name

# Add a development dependency
npm run deps:add:dev -- package-name
```

Or manually:

```bash
# Activate your virtual environment first
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Add a production dependency
uv add package-name

# Add a development dependency
uv add --dev package-name
```

### Syncing Dependencies

To sync dependencies based on requirements files:

```bash
# Sync production dependencies
npm run deps:sync

# Sync both production and development dependencies
npm run deps:sync:dev
```

Or manually:

```bash
# Activate your virtual environment first
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Sync production dependencies
uv pip sync requirements.txt

# Sync both production and development dependencies
uv pip sync requirements.txt requirements-dev.txt
```
