---
description: ColorAgent Monorepo
author: Sean Bellows
version: 0.0.1
---

# PROJECT GUIDELINES

## MONOREPO STRUCTURE

- Use Turborepo for build orchestration and caching
- pnpm workspaces for dependency management
- Separate backend and frontend as distinct workspaces

## DOCUMENTATION GUIDELINES

- Update relevant documentation in "/docs" when modifying features
- Keep README.md in sync with new capabilities
- Maintain changelog entries in CHANGELOG.md

### Architecture Decision Records

Create ADRs in /docs/adr for:

- Major dependency changes
- pattern changes
- New integration patterns
- Database schema changes
- Follow template in "/docs/adr/template.md"

## TESTING

- After adding or updating tests, make sure they pass, by running them with pytest.
- When rerunning previously failed tests, specify the specific tests to re-run.
- Aim for 80% code coverage in general, but utility functions should have 100% coverage.

### Unit Tests

A good unit test should:

- focus on a single use-case at a time
- have a minimal set of assertions per test
- demonstrate every use case. The rule of thumb is: if it can happen, it should be covered

## CODE STYLE AND STRUCTURE

- Prioritize maintainability over development speed
- Keep data layer separate from view hierarchy
- Write clear, understandable code
- Think data first, implement views second
- Follow clean architecture principles

## ERROR HANDLING

- Implement granular error types
- Use graceful degradation strategies
- Implement comprehensive error logging
- Use error recovery mechanisms

## JSON SANITIZATION

- Sanitize JSON throughout the transformation pipeline
- Handle BOM characters properly
- Handle nested stringified JSON
- Implement proper error handling for malformed JSON

## SECURITY

- Implement proper database security measures
- Integrate infrastructure for using KeyCloak as the authorization platform in both the frontend and backend
- Use secure headers and CORS policies
- Implement audit logging for sensitive operations
