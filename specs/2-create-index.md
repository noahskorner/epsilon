## Goal

Provide an endpoint for creating and provisioning search indexes.

## Requirements

- **POST /indexes**
  - **Request Fields**
    - `id` (primary key)
    - `name` (unique)
    - `dbName` (system-generated)
    - `description` (optional)

- **Validation**
  - `name` must be unique
  - `description`, if provided, must be within an acceptable length

- **Persistence**
  - Store index record in the database

- **Provisioning**
  - Provision a new pgvector-backed database
  - Implement a minimal resource-manager package to handle database provisioning
  - Use the environment package for required environment variables

- **Response**
  - `201 Created`
  - `Location` header pointing to `/indexes/{id}`
