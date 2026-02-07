## Goal

Build a simple, minimal **Create Asset API**: `POST /api/assets`.

An **asset** represents an educational resource such as:

- YouTube or external links
- Articles
- Uploaded files
- Markdown content

---

## API

**POST /api/assets**

Creates a new asset and returns an abstract asset representation.

---

## Implementation Guidelines

- Use the existing `files/create-files` feature as the reference pattern for API design.
- Update the following as required:
  - `openapi.json`
  - `docs/route.ts`
- The OpenAPI response should expose an **abstract asset type**, not concrete implementations.
- For file uploads:
  - Use the `blob-storage` package exclusively.
- Always use shared packages as appropriate:
  - `blob-storage` for file storage
  - `database` for persistence
  - `environment` for configuration

---

## Data Model

Keep the schema minimal. Update `schema.prisma` with the following model:

### `Asset`

- `id`
- `name`
- `type` (enum)
- `createdById`
- `createdAt`
- `updatedById`
- `updatedAt`
- `metadata` (JSON)
  - Stores type-specific asset data (e.g. URL, blob reference, markdown content)
- Any additional fields strictly required for functionality

---

## Notes

- Asset behavior and structure should be driven by `type + metadata`.
- Avoid over-modeling concrete asset types in the database.
- Favor flexibility and forward compatibility.
