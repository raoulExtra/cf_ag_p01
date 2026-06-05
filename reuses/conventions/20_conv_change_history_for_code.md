```yaml
title: 'Convention: Change History for code'
tags:
- ai_entities
- conventions
persona: kilo_extension
status: active
version: V00.05.00
updated: 2026-06-04
summary: 'Convention document: Change History for code.'
```

# Convention: Change History for code

> Version: V00.05.00

## Rule

Source code files SHOULD include a comment block tracking changes over time.

### Format

```python
# Change History
#
# | Version | Date | Author | Reason |
# |---------|------|--------|--------|
# | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |
```

### Constraints

- `Version`
  - MUST use the repo version format: `V00.01.00`
  - See: `10_conv_versions.md`
- `Date`
  - MUST use ISO format: `YYYY-MM-DD`
- `Author`
  - SHOULD be a dynamic identifier "## Current AI" (e.g. `peter`, `ai(kilo laguna)`)
  - See: [10_conv_versions.md](10_conv_versions.md)
- `Reason`
  - MUST be short and specific (what changed + why)
- `getVersion()`
  - MUST export a `getVersion()` function returning the current version string

### Placement

python:
- Place at the top of the file after imports
- Or at the bottom in a trailing comment block
node:
- do compareable as in python

## Example

```python
from __future__ import annotations

__version__ = "V00.01.00"



# Change History
#
# | Version | Date | Author | Reason |
# |---------|------|--------|--------|
# | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |
```

## Rationale

- Tracks evolution of code alongside documentation
- Enables blame-free historical context
- Supports automated version extraction

---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.05.00 | 2026-06-05 | ai(cline) | Move conventions to reuses/conventions |
| V00.04.00 | 2026-06-04 | ai(cline) | Add link to 10_conv_versions.md in Author constraint |
| V00.02.00 | 2026-06-04 | ai(kilo laguna) | Add getVersion() requirement |
| V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |