---
name: add-environment-variable
description: Add or modify environment variables in this repo. Use when a new config value is needed by the app or packages, when an existing env var changes, or when updating validation and .env.example entries. Applies to packages/environment and apps/web env files.
---

# Add Environment Variable

## Overview

Update the typed environment definition and validation in `packages/environment/src/index.ts`,
then keep `apps/web/.env.example` in sync so developers know what to set locally.

## Workflow

### 1. Decide required vs optional

This repo models required env vars via `Environment` and `REQUIRED_KEYS`.
If the new value is optional, do not add it to `REQUIRED_KEYS` and consider using a union
type or `Partial` access in downstream code.

### 2. Update the typed schema and validation

In `packages/environment/src/index.ts`:

- Add the new key to the `Environment` interface.
- If required, add the key to `REQUIRED_KEYS`.
- If it should be a valid URL, add it to `URL_KEYS`.
- If it needs special validation (email-like, number, boolean, enum), add a focused
  validation check similar to `EMAIL_FROM_KEY`.

Keep validation simple and local; avoid introducing new dependencies unless necessary.

### 3. Update env templates

Add the new variable to `apps/web/.env.example` with a safe placeholder value.
Do not commit secrets. Do not edit `apps/web/.env.local` unless explicitly asked.
If the variable is also required by Azure Functions workers, update the worker settings
source (for example local Functions settings) in the same change when requested.

### 4. Wire usage in code

Use `ENV.<KEY>` from the `environment` package in app or package code. If the variable
configures an infrastructure dependency (`resource-manager`, `events`, storage, etc.),
wire it through `apps/web/app/services.ts` so handlers/actions resolve configured services
from DI instead of reading env vars directly.

### 5. Keep package boundaries intact

- Put env usage in the package or app that owns the integration.
- Keep `packages/resource-manager` and `packages/events` configuration typed through
  `packages/environment/src/index.ts` and injected at registration time.
- For queue-based flows, keep `packages/events` config in sync with worker storage/queue
  settings used by `apps/worker` triggers.
- Avoid introducing direct `process.env` access in feature code; prefer `ENV` + DI.

## Quick Example

When adding `SENTRY_DSN` that must be a URL:

1. Add `SENTRY_DSN` to `Environment` and `REQUIRED_KEYS`.
2. Add `SENTRY_DSN` to `URL_KEYS`.
3. Add a placeholder to `apps/web/.env.example`.
4. Reference `ENV.SENTRY_DSN` where needed.
