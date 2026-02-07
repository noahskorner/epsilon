## Goal

Implement a simple API endpoint to create a course.

- **Endpoint:** `POST /api/courses`
- **Purpose:** Persist a new course record and return the created resource.

---

## Data Model

### `course`

| Field         | Description                      |
| ------------- | -------------------------------- |
| `id`          | Unique identifier                |
| `name`        | Course name                      |
| `subject`     | Course subject or category       |
| `createdById` | User who created the course      |
| `createdAt`   | Timestamp of creation            |
| `updatedById` | User who last updated the course |
| `updatedAt`   | Timestamp of last update         |

---

## Request

**Body**

- `name` (string, required)
- `subject` (string, required)

---

## Response

- **201 Created** — returns the created `course`
- **400 Bad Request** — invalid or missing input
- **401 Unauthorized** — user not authenticated
