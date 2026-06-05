```yaml
title: 'Convention: versioning of markdown docs'
tags:
- version
- conventions
persona: kilo_extension
status: active
version: V00.02.00
updated: 2026-06-05
summary: 'Convention document: Convention: versioning of markdown docs.'
```

# Convention: versioning of markdown docs
> Version: V00.02.00

## Purpose

Standardize how we record versions and change history inside markdown documents.

## Current AI
author ai(cline)

## Version format

- `V<MAJOR>.<MINOR>.<PATCH>`
- Example: `V00.01.00`

### When to increment

- MAJOR: breaking conceptual changes, restructuring, paradigm shifts
- MINOR: significant additions (new sections/meaningful content)
- PATCH: corrections/typos/formatting

## Required header

Directly below the title:

```markdown
# Document Title
> Version: V00.01.00
```

## Required change history (end-of-file)

Every doc ends with:

```markdown
---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.01.00 | 2026-05-13 | ai(deepseek) | Document created |
```

Rules:

- Most recent version first (descending)
- Date format: `YYYY-MM-DD`
- Reason: one sentence

## Starting version

- New documents start at: `V00.01.00`

---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.02.00 | 2026-06-05 | ai(cline) | Update current AI identifier |
| V00.01.00 | 2026-05-24 | ai(cline) | Migrate markdown versioning convention into canonical ai_env/conventions |