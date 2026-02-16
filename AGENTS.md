# Repository Guidelines

Welcome to this Turborepo-based Next.js + Prisma monorepo. Use this guide to keep contributions consistent and fast to review.

## Project Structure & Module Organization

- Root scripts orchestrate workspaces via Turborepo (`package.json`, `turbo.json`).
- `apps/web/` holds the Next.js 15 app (app router). UI primitives live in `components/`, client utilities in `hooks/` and `lib/`, and static assets in `public/`.
- `apps/worker/` is the Azure Functions worker app (TypeScript, Functions v4). Queue/background processing code lives in `src/functions/`.
- Declare app routes in `apps/web/app/routes.ts` and use that object everywhere instead of hardcoding paths.
- `apps/web/app/services.ts` contains the dependency injection container (`ServiceCollection`/`ServiceScope`) and service tokens. Resolve infrastructure dependencies from this container instead of constructing them in route handlers and server actions.
- `packages/database/` contains the Prisma schema, migrations, and generated client.
- `packages/resource-manager/` provides resource provisioning services (currently `PostgresResourceManager` for pgvector database provisioning).
- `packages/events/` provides event publishing abstractions (currently `AzureQueueStorage` for queue-backed events).
- `FEATURES.md` is the product specification; use it as the source of truth for behavior and scope.
- `.turbo/` and `.next/` are build caches; avoid committing them.

## Dependency Installation Rules

**Install dependencies at the narrowest possible scope.**

- If a dependency is only used by a specific app or package, install it **inside that app or package**, not at the repo root.
- Only add dependencies to the root `package.json` if they are:
  - Shared tooling (e.g., Turborepo, ESLint, Prettier), or
  - Required by multiple apps/packages.

**Examples:**

- If a dependency is needed by the Next.js app, install it in:
  ```bash
  cd apps/web
  npm install <package>
  ```
- (updates `apps/web/package.json`)

- If a dependency is only used by the Prisma/database layer:
  ```bash
  cd packages/database
  npm install <package>
  ```

- If a dependency is only used by resource provisioning or event publishing, install it in the owning package:
  ```bash
  cd packages/resource-manager
  npm install <package>
  ```
  ```bash
  cd packages/events
  npm install <package>
  ```

- Avoid installing app-specific or package-specific dependencies at the root unless there is a clear, documented reason.

This keeps dependency graphs clean, reduces unnecessary rebuilds, and avoids accidental coupling between apps.

## Build, Test, and Development Commands

- Install once at root: `npm install`.
- Start dev (Next + watches): `npm run dev`.
- Build all apps/packages: `npm run build`.
- Lint (Next ESLint flat config): `npm run lint`.
- Run Azure Functions worker only: `npm --prefix apps/worker run dev` (use `npm --prefix apps/worker run watch` in another terminal for TypeScript watch mode).
- Bring up Postgres/pgvector: `npm run setup` (runs `docker compose up -d`).
- Prisma workflows (env read from `apps/web/.env.local`):

  - `npm run prisma:migrate:dev` (root turbo task) or `npm --prefix packages/database run prisma:migrate:dev`.
  - Regenerate client: `npm --prefix packages/database run prisma:generate`.

## Coding Style & Naming Conventions

- TypeScript-first. Components/pages in PascalCase files; hooks/utilities in camelCase.
- Prettier (`.prettierrc.js`): 2-space indent, 100-char line width, semicolons, single quotes, trailing commas (es5).
- ESLint: Next core web vitals + TypeScript; prefer typed props and avoid `any`.
- Stick to Next app-router conventions (`app/` routes, server actions). Keep shared UI in `components/` to avoid duplication.
- For backend/infrastructure wiring in `apps/web`, use DI from `apps/web/app/services.ts` (`createServiceScope`, `SERVICE_TOKENS`) rather than constructing package clients directly in route handlers.
- For asynchronous/background work, publish events from `apps/web` through `packages/events` (registered in `apps/web/app/services.ts`) and consume them in `apps/worker/src/functions/*` via queue triggers.
- Keep queue contracts explicit: align queue names and payload shape between the event publisher (`packages/events`) and the worker trigger bindings.

## Testing Guidelines

- No suite is configured yet; when adding tests, use Jest + React Testing Library for UI and place specs as `*.test.tsx` near components or under `__tests__/`.
- Mock Prisma and external services; keep tests deterministic. Aim for meaningful coverage on server actions and form flows.

## Commit & Pull Request Guidelines

- Follow Conventional Commits as seen in history (`feat:`, `chore:`, `fix:`). Imperative mood, scope optional.
- PRs should state intent, link issues, and note any schema or env changes. Include screenshots/GIFs for UI changes and list manual test steps.
- If migrations are included, call out the migration name and ensure `schema.prisma` and `migrations/` are in sync.

## Security & Configuration Tips

- Copy env templates from `apps/web/.env.example` to `.env.local`; never commit secrets.
- Database URLs must match the docker-compose service; restart containers after env changes.
- Keep package-level configuration typed in `packages/environment/src/index.ts` and consume it via `ENV` in service registrations (`apps/web/app/services.ts`) instead of direct `process.env` access in feature code.
- For local queue processing, keep worker storage connection (`AzureWebJobsStorage` in Azure Functions settings) aligned with Azurite credentials used by `packages/events`.
- Clean stale builds with `npx turbo clean` (or remove `.turbo/`) when caches misbehave.
