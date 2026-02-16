---
name: api-endpoint
description: Add or modify API endpoints with database schema changes and OpenAPI docs in this repo. Use when backend/API work touches app routes, facades, infrastructure services, or package integrations such as `database`, `resource-manager`, and `events`.
---

# Create API Endpoint Skill

## When to use

Use this skill when a request requires:

- A new or updated API endpoint.
- Database schema changes or migrations.
- Updates to OpenAPI documentation or API docs routes.

## Instructions

1. Read the product spec or request details, plus `FEATURES.md` when scope is unclear.
2. Identify an existing endpoint or feature to mirror for structure and conventions.
   - Good examples: `apps/web/app/api/assets`.
3. Define the API surface:
   - Route path and HTTP method.
   - Request and response shapes.
   - Error cases and status codes.
4. Plan file changes across layers:
   - API handlers in `apps/web/` (app router).
   - Shared route definitions in `apps/web/app/routes.ts` (avoid hardcoded paths).
   - Service registration/resolution in `apps/web/app/services.ts` for infrastructure dependencies.
   - Worker queue consumers in `apps/worker/src/functions/*` when the endpoint emits async events.
   - Database schema in `packages/database/schema.prisma`.
   - OpenAPI docs in `apps/web/app/api/openapi.json/route.ts` and `apps/web/app/api/docs/route.ts`.
5. Implement schema updates and migrations:
   - Keep models minimal and aligned to the spec.
   - Add enums only when they are required by the API contract.
   - Never manually generate SQL for migrations; always run `npm --prefix packages/database run prisma:migrate:dev`.
6. Implement the API endpoint:
   - Use shared packages (`database`, `environment`, `blob-storage`, `resource-manager`, `events`) instead of duplicating logic.
   - Resolve infrastructure dependencies via `createServiceScope()` + `SERVICE_TOKENS` from `apps/web/app/services.ts`.
   - Validate inputs and return typed responses.
7. Update OpenAPI documentation:
   - Add or update paths, request bodies, and response schemas.
   - Keep the API surface abstract when required (avoid over-modeling variants).

## Repo Conventions for New Endpoints

Follow the existing patterns in `apps/web/app/api/assets`.

- **Folder layout**
  - Base route: `apps/web/app/api/<resource>/route.ts`
  - Parameterized route: `apps/web/app/api/<resource>/[id]/route.ts`
  - Co-locate schemas and facade in the same folder.
- **Schema files (Zod + OpenAPI)**
  - Create `*.request.ts` and `*.response.ts` files per endpoint.
  - Import Zod via `import { z } from '@/app/utils/zod';` to enable `.meta(...)`.
  - Add `.meta({ title: '...' })` on each schema and add per-field `description`/`example`.
  - Expose types via `export type ... = z.infer<typeof ...Schema>;`.
- **Facade layer**
  - Use `*.facade.ts` classes for data access and side effects.
  - Use `PRISMA` from `apps/web/app/prisma.ts` (configured with `ENV.DATABASE_URL`).
  - Use `ENV` from `environment` for config; avoid `process.env` in app code.
  - Use `getBlobStorage()` from `apps/web/app/blob-storage.ts` for storage operations.
  - Keep route handlers thin: parse, call facade, return response.
- **Service wiring (DI)**
  - Register app-level infrastructure services in `apps/web/app/services.ts`.
  - Add a token to `SERVICE_TOKENS` and register with the correct lifetime (`singleton`, `scoped`, `transient`).
  - In route handlers/server actions, create a scope and resolve dependencies from it.
  - Avoid `new <InfraClient>()` inside handlers/actions when the service can be registered once in DI.
- **Async events + workers**
  - Publish queue events through `packages/events` from facades/actions/routes (resolved through DI in `apps/web/app/services.ts`).
  - Handle queue events in Azure Functions under `apps/worker/src/functions/*` (for example, `app.storageQueue(...)` triggers).
  - Keep queue names and message schema aligned between publisher and worker trigger.
  - For local development, ensure worker storage settings match the Azurite setup used by the app/event publisher.
- **Route handlers**
  - Use `NextRequest` + `NextResponse` and wrap logic in `try/catch`.
  - Parse body with the request schema; parse params with a params schema.
  - Return JSON on success, `{ error: message }` with status `400` on failures.
  - Use `201` for create, `200` for GET, `204` for successful updates with no body.
- **OpenAPI docs**
  - Update `apps/web/app/api/openapi.json/route.ts` with new path + schema refs.
  - Import the new request/response schemas and wire them into `createDocument`.
  - `apps/web/app/api/docs/route.ts` points to the OpenAPI JSON endpoint.

## Notes

- Follow existing patterns in similar features before introducing new abstractions.
- Avoid installing dependencies at the repo root unless shared by multiple apps/packages.
