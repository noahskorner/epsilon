## Goal

Build a platform for creating, running, and evaluating experiments for AI agents.

## Core Capabilities

### Index Management

- Create search indexes
  - Provision pgvector-backed databases
  - Ingest documents with:
    - `id`
    - `title`
    - `context`
    - `contentType`
    - `content`
    - `views`
      - `search`
        - `context`
        - `contentType`
        - `content`
      - `agent`
        - `context`
        - `contentType`
        - `content`
    - `vector`
      - `dimensions`
    - `chunkSize`
    - `overlapSize`
    - `metadata` (JSON; filterable, slower queries)

### Experiments

- Experimental indexes
  - A/B testing and traffic splitting
  - Vary:
    - Document content
    - `chunkSize`
    - `overlapSize`
- Experimental agents
  - Variant prompts
  - Variant tools
- Test cases
  - Deterministic message/step sequences cloned from agent configs
  - Evaluation:
    - LLM-as-judge (configurable prompts)
    - Human-as-judge

### Agent Execution

- Run agentic workflows across standard and experimental configurations

### Conversations & Memory

- Create, read, and update conversations
- Persisted conversation history
- Memory support
  - Experiment with memory-capture strategies
- Response delivery
  - Direct workflow streaming
  - Conversations API (persisted + memory-aware)
