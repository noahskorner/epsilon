## Goal

Create a minimal environment configuration package with a clear, strongly typed interface.

## Principles

- Keep the implementation as small and simple as possible.
- Centralize all environment variable access.
- Fail fast if required environment variables are missing or invalid.

## Requirements

- Load environment variables from the runtime environment.
- Define a single, strongly typed interface representing all environment values.
- Required variables must be non-optional (no `?` or `| undefined`).
- Optional variables must be explicitly marked as such.
- Validate and parse environment variables at startup.
- Surface clear errors when required variables are missing or malformed.

## Usage

- Replace all direct access to environment variables (e.g. `process.env`) with this package.
- Consumers should import the typed environment object and never read raw environment variables directly.
