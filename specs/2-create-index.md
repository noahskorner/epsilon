## Goal

Provide an endpoint that allows users to create and provision search indexes.

## Requirements

- **POST /indexes**
  - Fields:
    - `id` (primary key)
    - `name` (unique)
    - `dbName` (system-generated)
    - `description` (optional)

- Validate:
  - `name` must be unique
  - `description`, if provided, must be within a reasonable length

- Persist the index metadata to the database

- Provision a new pgvector-backed database using the environment package

- Respond with:
  - `201 Created`
  - `Location` header pointing to `/indexes/{id}`
