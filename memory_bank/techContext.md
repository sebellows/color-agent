# Technical Context: ColorAgent

## Technology Stack

### Frontend
- **Mobile Apps**: React Native for cross-platform development
  - TypeScript for type safety
  - Expo for faster development and easier deployment
  - Zustand for state management
  - React Navigation for routing
  - Custom UI components using Shopify's Restyle

- **Web Application**: React with React Native Web
  - TypeScript for type safety
  - Next.js for server-side rendering and routing
  - Zustand for state management
  - Custom UI components shared with mobile via packages/ui
  - React Query for data fetching

### Backend
- **API Layer**: FastAPI (Python)
  - Pydantic for data validation
  - Async endpoints for improved performance
  - OpenAPI documentation

- **Service Layer**: Python modules
  - Domain-driven design principles
  - Dependency injection

- **Data Layer**: SQLAlchemy ORM
  - Repository pattern implementation
  - Query optimization

### Infrastructure
- **Database**: PostgreSQL
  - PostGIS extension for spatial data
  - JSONB columns for flexible schema
  - Proper indexing for performance

- **Caching**: Redis
  - Session storage
  - Rate limiting
  - Application caching

- **Local Storage**: 
  - JSON files stored locally within the application
  - No external object storage needed
  - Colors sampled from images displayed in custom SVG components

- **Deployment**: Docker containers
  - Kubernetes for orchestration
  - CI/CD pipeline with GitHub Actions
  - Infrastructure as Code with Terraform
  - Turborepo for monorepo management and build optimization

## Development Environment

### Local Setup
- Turborepo with the `with-react-native-web` template
- Docker Compose for local development
- Pre-commit hooks for code quality
- Environment variable management with .env files
- Hot reloading for faster development

### Required Tools
- Node.js (v18+)
- Python (v3.11+)
- Docker and Docker Compose
- pnpm for package management
- PostgreSQL client
- Redis client
- Turborepo CLI

### IDE Configuration
- VSCode with recommended extensions
  - ESLint
  - Prettier
  - Python extension
  - Docker extension
  - EditorConfig

## Technical Constraints

### Performance Requirements
- API response time < 200ms for 95% of requests
- Mobile app startup time < 2 seconds
- Web app initial load < 1.5 seconds
- Support for 10,000+ concurrent users

### Security Requirements
- OWASP Top 10 compliance
- GDPR compliance for user data
- Regular security audits
- Secure authentication and authorization
- Data encryption at rest and in transit

### Scalability Considerations
- Horizontal scaling for API servers
- Database read replicas for scaling read operations
- Caching strategy for frequently accessed data
- CDN for static assets and images
- Microservices architecture for future growth

### Compatibility Requirements
- Mobile: iOS 14+, Android 9+
- Web: Latest 2 versions of major browsers
- Responsive design for all screen sizes
- Offline capability for core features
- Accessibility compliance (WCAG 2.1 AA)

## Third-Party Integrations

### Authentication
- Auth0 or Firebase Authentication
- Social login options (Google, Apple, Facebook)
- JWT-based session management

### Analytics
- Google Analytics for web
- Firebase Analytics for mobile
- Custom event tracking for user actions

### Image Processing
- Sharp for server-side image processing
- React Native Image for mobile image handling
- Cloudinary for image transformations and optimization

### Payment Processing
- Stripe for subscription and one-time payments
- PayPal as alternative payment option

### Notifications
- Firebase Cloud Messaging for mobile push notifications
- SendGrid for email notifications
- In-app notification system

## Development Workflow

### Git Strategy
- GitHub for repository hosting
- Feature branch workflow
- Pull request reviews required
- Semantic versioning

### CI/CD Pipeline
- Automated testing on pull requests
- Linting and code quality checks
- Build and deployment automation
- Environment promotion (dev → staging → production)

### Testing Strategy
- Unit tests with Jest (frontend) and pytest (backend)
- Integration tests for API endpoints
- E2E tests with Cypress (web) and Detox (mobile)
- Performance testing with k6
- Accessibility testing with axe

### Documentation
- OpenAPI/Swagger for API documentation
- Storybook for UI components
- README files for all repositories
- Architecture decision records (ADRs)
- User guides and developer documentation

## Monitoring and Observability

### Tools
- Prometheus for metrics collection
- Grafana for dashboards and visualization
- ELK stack for log aggregation
- Sentry for error tracking
- Uptime monitoring with Pingdom or similar

### Key Metrics
- API response times
- Error rates
- User engagement metrics
- Infrastructure utilization
- Business KPIs

## Backup and Disaster Recovery

- Daily database backups
- Point-in-time recovery capability
- Multi-region redundancy for critical services
- Documented recovery procedures
- Regular recovery testing
