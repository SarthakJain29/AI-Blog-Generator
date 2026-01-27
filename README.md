# My Monorepo

A Turbo + Bun monorepo with a Next.js frontend and an Express.js Dockerized API backend.

## Apps

- `@my-scope/web`: Next.js frontend (default port `3000`)
- `@my-scope/api`: Node/Express API service (default port `5000`, Docker-ready)

## Packages

- `packages/eslint-config`: shared ESLint flat config (`@my-scope/eslint-config`)
- `packages/typescript-config`: shared TS configs (`@my-scope/typescript-config`)
- `packages/utils`: shared utility library (`@my-scope/utils`)
- `packages/db`: shared database models (`@my-scope/db`)
## Requirements

- Node.js `>= 18`
- Bun `>= 1.1`
- Docker (only if you want to run the backend container)

## Setup

```bash
bun install
```

Optional env file at the repo root:

```bash
# .env
NEXT_PUBLIC_WEB_PORT=3000

# Backend
API_PORT=5000

NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run Everything (Turbo)

```bash
bun run dev
```

This runs all `dev` scripts via Turbo. By default:

- Web: http://localhost:3000
- API: http://localhost:5000/health

## Run Apps Separately

Frontend only:

```bash
bun run dev --filter=@my-scope/web
```

Backend only:

```bash
bun run dev --filter=@my-scope/api
```

## Build and Start

Build all workspaces:

```bash
bun run build
```

Start a single app:

```bash
bun run start --filter=@my-scope/web
bun run start --filter=@my-scope/api
```

## Lint and Typecheck

```bash
bun run lint
bun run typecheck
```

## Backend Docker (apps/api)

Build the image:

```bash
docker build -f apps/api/Dockerfile -t prescription-ai-api .
```

Run the container:

```bash
docker run -p 5000:5000 prescription-ai-api
```

Health check:

```bash
curl http://localhost:5000/health
```

## Project Structure

```
.
├── apps/
│   ├── web/               # Next.js 15 frontend
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── api/               # Express.js backend
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   ├── typescript-config/ # Shared TypeScript configs
│   ├── eslint-config/     # Shared ESLint configs
│   └── utils/             # Shared utilities
├── turbo.json            # Turbo pipeline config
├── package.json          # Root workspace config
└── .env                  # Environment variables
```

## Scripts Reference

All workspaces implement the same script contract:

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `typecheck` - Run TypeScript type checking
- `clean` - Clean build artifacts

## Turbo Pipeline

The `turbo.json` defines task dependencies and caching:

- `^build` means "depends on workspace dependencies' build"
- `.dist/**` and `.next/**` are cached outputs
- `.env` is a global dependency (invalidates cache when changed)
- `dev` and `start` are persistent tasks (keep running)

## Adding New Apps or Packages

1. Create the workspace in `apps/*` or `packages/*`
2. Add `package.json` with the standard scripts
3. Reference shared configs: `@prescription-ai/typescript-config` and `@prescription-ai/eslint-config`
4. Use workspace dependencies with `"@my-scope/*": "*"`

## License

Private monorepo - all rights reserved.
