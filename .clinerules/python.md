---
description: ColorAgent rules for writing backend code
author: Sean Bellows
version: 0.0.1
globs: *.py
tags: ["backend", "api", "coding-guidelines"]
---

You are an expert in Python and writing scalable API applications using FastAPI, SQLAlchemy, and Pydantic.

## Key Principles

  - Write clear, technical responses with precise FastAPI examples.
  - Use descriptive variable and function names; adhere to naming conventions (e.g., lowercase with underscores for functions and variables).

# Python

  - Async-first development
  - Use Pydantic for Type safety along with its BaseModel with support for Python's dataclasses for simple, shared models between python projects
  - Dependency injection
  - Follow SOLID principles
  - Use middleware judiciously to handle cross-cutting concerns like authentication, logging, and caching.

## Error Handling and Validation

  - Prefer try-except blocks for handling exceptions in business logic.
  - Create custom error responses (e.g., 404, 500) where those errors are in the domain of the application.
  - Apply Open Telemetry style logging to errors.

## Dependencies

  - Python v3.13+
  - Pydantic
  - Redis (for caching and task queues)
  - Celery (for background tasks)
  - PostgreSQL (preferred databases for production)

## Performance Optimization

  - Optimize query performance using related object fetching.
  - Use Redis or Memcached to reduce database load.
  - Implement database indexing and query optimization techniques for better performance.
  - Use asynchronous views and background tasks (via Celery) for I/O-bound or long-running operations.

## Logging

  - As a general rule, we should have logs for every expected and unexpected actions of the application, using the appropriate log level.
  - Python exceptions should almost always be captured automatically without extra instrumentation, but custom ones (such as failed requests to external services, query errors, or Celery task failures) can be tracked using capture_exception().

## Log Levels

  - A log level or log severity is a piece of information telling how important a given log message is:
    - DEBUG: should be used for information that may be needed for diagnosing issues and troubleshooting or when running application in the test environment for the purpose of making sure everything is running correctly
    - INFO: should be used as standard log level, indicating that something happened
    - WARN: should be used when something unexpected happened but the code can continue the work
    - ERROR: should be used when the application hits an issue preventing one or more functionalities from properly functioning

## Logging Format

  - Use Structlog as the default logging library. It's a structured logging framework that adds cohesive metadata on each logs that makes it easier to track events or incidents.
  - Structured logging means that you don’t write hard-to-parse and hard-to-keep-consistent prose in your logs but that you log events that happen in a context instead.

  (example)

  ```python
  import structlog
  logger = structlog.get_logger(__name__)
  logger.debug("event_sent_to_kafka", event_uuid=str(event_uuid), kafka_topic=topic)
  ```

  will produce:

  ```sh
  2021-10-28T13:46:40.099007Z [debug] event_sent_to_kafka [posthog.api.capture] event_uuid=017cc727-1662-0000-630c-d35f6a29bae3 kafka_topic=default
  As you can see above, the log contains all the information needed to understand the app behaviour.
  ```

## Security

  - Don’t log sensitive information. Make sure you never log:
    - authorization tokens
    - passwords
    - PII (Personal Identifiable Information)

## Testing

  - After adding or updating tests, make sure they pass, by running them with pytest.
  - When rerunning previously failed tests, specify the specific tests to re-run.
  - All new packages and most new significant functionality should come with unit tests
  - Significant features should come with integration and/or end-to-end tests
  - Analytics-related queries should be covered by snapshot tests for ease of reviewing
  - Always consider if you can simplify a test by using the `parameterized.expand` decorator

## Unit Tests
  - A good unit test should:
    - focus on a single use-case at a time
    - have a minimal set of assertions per test
    - demonstrate every use case. The rule of thumb is: if it can happen, it should be covered

## Integration Tests

  - Integration tests should ensure that the feature works end-to-end. They must cover all the important use cases of the feature.
  
## Running Commands

- Use `uv sync` instead of `pip install -r ...`, and `uv add PACKAGE` instead of `pip install PACKAGE`. If there is an import error, first activate the venv at `.venv/`.
