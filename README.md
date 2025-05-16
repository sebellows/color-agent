# ColorAgent

**ColorAgent**, a paint comparison tool for hobbyists powered by Ambivalent Intelligence.

ColorAgent is built with React Native Web for the frontend with a Python/FastAPI backend.

## Project Structure

```
color-agent/
├── apps/                # Application code
│   ├── api/             # FastAPI backend
│   ├── native/          # React Native mobile app
│   └── web/             # Next.js web app
├── packages/            # Shared packages
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── ui/              # Shared UI components
├── docs/                # Documentation
└── .turbo/              # Turborepo cache
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8.6.0 or later)
- Python (v3.13 or later)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up Python environment for the API:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv sync
```

### Development

Run the development servers:

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm --filter @color-agent/web dev
pnpm --filter @color-agent/api dev
pnpm --filter @color-agent/native dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @color-agent/web build
```

## Features

- **Monorepo Structure**: Using Turborepo for build orchestration and caching
- **Frontend**: React Native Web for cross-platform UI
- **Backend**: FastAPI for high-performance API
- **Shared UI**: Common UI components shared between web and mobile
- **Type Safety**: TypeScript and Pydantic for type safety

## Documentation

Additional documentation can be found in the `/docs` directory.

## Testing

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm --filter @color-agent/web test
pnpm --filter @color-agent/api test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
