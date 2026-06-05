```yaml
title: 'Convention: README Content'
tags:
- ai_entities
- conventions
persona: kilo_extension
status: active
version: V00.01.00
updated: 2026-06-04
summary: 'Convention document: README content structure and requirements.'
```

# Convention: README Content

> Version: V00.01.00

## Rule

Every project MUST have a README.md with exactly 3 sentences in the opening section.

### Format

```markdown
# Project Name

Sentence 1: Describe what the project demonstrates or does.
Sentence 2: Describe the core functionality or architecture.
Sentence 3: Describe the technology stack or deployment.

## Content Info
conventions: link to conventions with descriptions

## Structure
...
```

### Sentence Requirements

1. **Sentence 1**: High-level project description (what it demonstrates)
2. **Sentence 2**: Core functionality (how it works)
3. **Sentence 3**: Technology stack and deployment details

### Constraints

- Each sentence MUST be under 255 characters
- Sentences MUST be separated by blank lines
- Content Info section MUST list conventions used
- Structure section MUST show directory layout

## Example

```markdown
# Multi-Agent System on Cloudflare Workers

Phase 1 demonstrates multi-agent functionality. Two AI agents communicate via R2 file storage and work in parallel. Built with Cloudflare Wrangler, agents run in isolated Durable Objects, use R2 for file storage and KV for atomic state operations.

## Content Info
conventions: code has `getVersion()` and Change History per `conventions/20_conv_change_history_for_code.md`, requirements have `### Test` chapters with TDD in `src/tests/`, and edge cases are covered per `conventions/30_conv_testing_requirements.md`.

## Structure
...
```

## Rationale

- Provides consistent project overview
- Enables quick understanding of project scope
- Documents conventions used in the project

---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.01.00 | 2026-06-04 | ai(cline) | Initial implementation |