# Stage 1: Base image
FROM node:22-alpine AS base

# Stage 2: Builder stage for pruning the monorepo
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include the web app and its dependencies
RUN turbo prune web --docker

# Stage 3: Install dependencies and build
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and lockfile
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/out/full/ .

# Build the project
# Add Turborepo remote caching support
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=web...

# Stage 4: Production image
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files for production
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "apps/web/server.js"]
