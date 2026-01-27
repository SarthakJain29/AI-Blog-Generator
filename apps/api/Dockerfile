# Multi-stage build for production
FROM node:18-alpine AS base

# Install Bun
RUN apk add --no-cache curl bash && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy workspace files
COPY package.json bun.lockb turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
FROM base AS deps
RUN bun install --frozen-lockfile

# Build packages and API
FROM deps AS builder
RUN bun run build:pkg
RUN bun run build --filter=@my-scope/api

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built API
COPY --from=builder /app/apps/api/.dist ./apps/api/.dist
COPY --from=builder /app/apps/api/package.json ./apps/api/

# Set environment
ENV NODE_ENV=production
ENV API_PORT=5001

EXPOSE 5001

# Run the API
CMD ["node", "apps/api/.dist/index.js"]
