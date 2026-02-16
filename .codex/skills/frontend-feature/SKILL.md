---
name: frontend-page-component
description: Create or update frontend pages and components in this Next.js app. Use when asked to add/modify UI routes, pages, or React components, especially when routes must be registered in `apps/web/app/routes.ts`, shadcn components are required, Tailwind classes are the default styling approach, and vertical-slice feature folders are expected.
---

# Frontend Page Component

## Overview

Build UI pages and components that follow this repo's routing, component, and architecture rules. Keep features self-contained, use shadcn UI primitives, and style with Tailwind by default.

## Workflow

1. Confirm the route and add it to `apps/web/app/routes.ts`.
2. Create a dedicated feature folder close to the route and keep it self-contained.
3. Keep `page.tsx` minimal; render a single feature component unless routing-specific logic must live there.
4. Implement UI with shadcn components from `components/ui` (add new shadcn components there if needed).
5. Prefer Next.js server components and SSR by default; use client components only when required.
6. Style with Tailwind classes; only use raw CSS when absolutely necessary.
7. Promote components/hooks/utils to shared folders only when reused across multiple features.
8. When a feature includes server actions with infrastructure dependencies, resolve them via `createServiceScope()` and `SERVICE_TOKENS` from `apps/web/app/services.ts`.

## Guardrails

- Always use fully qualified file names, except for Next.js–reserved conventions (e.g., create-index-form.ts instead of form.ts).
- Use the sonner/toast package for all user notifications (success and error states). Use error-toast.tsx to render server-side error messages on the client.
- All components must be mobile and darkmode friendly.
- Use React Hook Form for all form submissions.
- Prefer Next.js server actions for data creation when appropriate.
- For server actions that call backend facades/services, resolve dependencies via `apps/web/app/services.ts` instead of constructing infra clients inline.
- When UI actions kick off async backend work, prefer emitting queue events through `packages/events` (via DI) and let `apps/worker` Azure Functions process them.
- Prefer server-side rendering (SSR) when appropriate.
- Routes must be defined in `apps/web/app/routes.ts`; do not hardcode paths elsewhere.
- Keep each file focused on a single component when possible; avoid multi-component files.
- `page.tsx` should be nearly empty and delegate to a feature component unless routing logic is needed.
- Prefer Next.js server components and SSR by default; use client components only when necessary.
- Prefer shadcn components in `components/ui` for primitives and composition.
- Use Tailwind classes for styling; only introduce CSS files when Tailwind is insufficient.
- Follow vertical slice architecture: keep feature logic, UI, and helpers co-located; share only when reuse is proven.

```text
app/
├─ dashboard/
│  ├─ page.tsx
│  ├─ dashboard-component.tsx
│  ├─ use-dashboard.ts
components/
├─ ui/                               // shadcn components
├─ /                                 // shared components
hooks/                               // shared hooks
lib/                                 // shared utilities
```
