## Goal

Enable users to create a new course collaboratively with an AI assistant.

## Implementation

### Create Course Flow

- Build a simple, interactive **Create Course** interface.
- Use `shadcn/ui` components.
- Mock UI for any features not yet implemented.

### Initial State

- Display a centered chat window.
- On first prompt submission:
  - Initiate the conversation using `api/chat` and the `@vercel/ai` package.
  - Transition to the main editing experience.

### Main Editing Experience

- **Left Panel**
  - Persistent chat interface
  - Full chat history with the AI assistant
- **Right Panel (Primary View)**
  - AI-generated course syllabus, including:
    - Course title
    - Objectives
    - Assignments
    - Quizzes
    - Homework
    - Final exam (if applicable)
- Panels should be resizable with reasonable minimum widths to prioritize either chat or syllabus.
