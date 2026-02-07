## Goal

Provide an endpoint to retrieve a paginated list of search indexes.

## Requirements

- **GET /indexes?skip=0&take=10**
- Feature name: **find-indexes**
- Use a reusable **PagedResult** interface containing:
  - `totalCount`
  - `items`
- Return a **200 OK** response with the paged list of indexes
