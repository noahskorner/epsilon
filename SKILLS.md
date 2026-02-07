# Agent Skills — Simple Overview & Implementation Example

**Agent Skills:** Modular capabilities that extend an AI agent’s functionality. They are packaged as folders containing metadata, instructions, and optional scripts or resources that an agent discovers and loads on demand. This lets a general-purpose agent become “specialized” for specific tasks without repeatedly providing the same guidance. :contentReference[oaicite:0]{index=0}

---

## Minimal Skill Folder Structure

```

my_skill/
├── SKILL.md # Required: instructions + metadata
├── scripts/ # Optional executable code
└── references/ # Optional docs/templates

```

**SKILL.md format (YAML + Markdown):** :contentReference[oaicite:1]{index=1}

```markdown
---
name: summarize-text
description: Summarize plain text into concise paragraphs
---

# Summarize Text Skill

## When to use

Use this skill when the user wants a concise summary of a long text.

## Instructions

1. Read the input text.
2. Produce a summary of key points in 3–5 sentences.

## Example

Input: |
The quick brown fox jumped over the lazy dog …
Output:
A fox performed a jump over a resting dog, demonstrating agility.
```

---

## How an Agent Uses a Skill

1. **Discovery:** Agent scans available skills and loads metadata (`name`, `description`). ([Agent Skills][1])
2. **Activation:** When a user request matches a skill’s description, the agent loads full instructions. ([Agent Skills][1])
3. **Execution:** The agent follows the step-by-step instructions from the SKILL.md. ([Agent Skills][1])

---

## Simple Code Example (Pseudo-Python)

Below is a minimal reference that _simulates_ how a skill might be loaded and invoked in a Python agent script:

```python
import os
import yaml

# load skill metadata
def load_skills(dir_path):
    skills = {}
    for name in os.listdir(dir_path):
        skill_dir = os.path.join(dir_path, name)
        with open(os.path.join(skill_dir, "SKILL.md")) as f:
            text = f.read()
        # split frontmatter from instructions
        if text.startswith("---"):
            parts = text.split("---", 2)
            meta = yaml.safe_load(parts[1])
            instructions = parts[2].strip()
            skills[meta["name"]] = {"desc": meta["description"], "inst": instructions}
    return skills

# simple agent behavior
def run_agent(skills, request):
    for name, skill in skills.items():
        if skill["desc"] in request:
            print("Using skill:", name)
            print(skill["inst"])
            return f"Executed {name}"
    return "No skill matched"

# example usage
skills = load_skills("my_skills")
print(run_agent(skills, "Please summarize the text for me"))
```

**Notes:**

- This stub loads all skills in a directory and matches based on description in a naive way.
- Real frameworks use more sophisticated matching & context handling. ([Agent Skills][1])

---

## Key Properties

- **Modular:** Skills are separate folders of expertise. ([Agent Skills][1])
- **Lazy-loaded:** Only loaded when relevant to the request. ([Agent Skills][1])
- **Extensible:** Can bundle scripts, templates, and reference data. ([Agent Skills][1])
