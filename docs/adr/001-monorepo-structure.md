# ADR-001: Monorepo Structure

## Status

Accepted

## Context

We need to decide on a project structure that allows us to efficiently develop and maintain both the frontend and backend components of the ColorAgent application. The application consists of:

- A web application built with Next.js
- A mobile application built with React Native
- A backend API built with FastAPI
- Shared UI components and configurations

We need a structure that promotes code sharing, ensures consistency, and simplifies the development workflow.

## Decision

We will use a monorepo structure with Turborepo as the build system and pnpm workspaces for package management. The structure will be organized as follows:

```
color-agent/
├── apps/                # Application code
│   ├── api/             # FastAPI backend
│   ├── native/          # React Native mobile app
│   └── web/             # Next.js web app
├── packages/            # Shared packages
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── ui/              # Shared UI components
└── docs/                # Documentation
```

## Consequences

### Positive

- **Code Sharing**: Easier sharing of code between web and mobile applications
- **Consistent Development Experience**: Same tooling and workflows across all projects
- **Simplified Dependency Management**: Centralized dependency management with pnpm workspaces
- **Efficient Builds**: Turborepo provides caching and parallel execution for faster builds
- **Atomic Changes**: Ability to make atomic changes across multiple packages
- **Simplified CI/CD**: Single repository to configure for continuous integration and deployment

### Negative

- **Repository Size**: The repository will grow larger over time
- **Learning Curve**: Team members need to learn Turborepo and pnpm workspace concepts
- **Build Complexity**: More complex build configuration compared to separate repositories

## Alternatives Considered

### Multiple Repositories (Polyrepo)

- **Pros**: Clear separation of concerns, smaller repositories, independent versioning
- **Cons**: Harder to share code, more complex dependency management, difficult to make atomic changes across repositories

### Monorepo with Lerna

- **Pros**: Well-established tool, good community support
- **Cons**: Slower builds without caching, less integrated with modern JavaScript tooling

### Monorepo with Nx

- **Pros**: Powerful features, good integration with various frameworks
- **Cons**: Steeper learning curve, more complex configuration

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [React Native Web](https://necolas.github.io/react-native-web/)
