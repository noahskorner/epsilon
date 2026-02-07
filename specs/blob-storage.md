## Goal

Create a minimal blob-storage package with a clean, simple design.

## Scope

- Provide a small, abstract storage interface
- Provide a single concrete implementation for **Azure Blob Storage**
  - Use Azure SDKs
  - Support Azurite for local development

## Design Principles

- Prefer simplicity and clarity over completeness
- Minimal surface area
- No advanced features unless strictly necessary
- Easy to understand, easy to replace

## Requirements

- Define a storage interface (contract) that abstracts blob operations
- Implement the interface using Azure Blob Storage
- Ensure the implementation works with both Azure and Azurite
- Avoid over-engineering (no retries, caching, batching, or complex configuration)

## Non-Goals

- Multi-cloud support
- Advanced error handling or resilience
- Performance optimizations
- Access control or security abstractions beyond what Azure provides
