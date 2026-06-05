```yaml
title: 'Convention: Testing Requirements'
tags:
- ai_entities
- conventions
persona: kilo_extension
status: active
version: V00.04.00
updated: 2026-06-04
summary: 'Convention document: Testing requirements and TDD implementation.'
```

# Convention: Testing Requirements

> Version: V00.04.00

## Rule

Requirements documents MUST include a `### Test` chapter and implementation MUST follow TDD with test code in the repository.

### Format

Every requirement section MUST include a test subsection:

```markdown
### Test
- [x] **TEST-<ID>** Description of test coverage
- [x] **TEST-<ID>** Reference the core requirement id you test with e.g. **FR-MA-CORE-01**
```

### Implementation Location

Tests MUST be implemented in: `src/tests/<testtype>/<feature>.test.ts`

Examples:
- `src/tests/unit/base-agent.test.ts`
- `src/tests/integration/agent-communication.test.ts`
- `src/tests/simulation/multi-agent-sim.test.ts`

### TDD Workflow

1. Write test FIRST (Red)
2. Implement code to pass test (Green)
3. Refactor while keeping tests green (Refactor)

### Test Types

- **Unit tests**: Test individual functions/classes in isolation
- **Integration tests**: Test interactions between components
- **Simulation tests**: Test multi-agent scenarios without consuming tokens

### Constraints

- Tests MUST reference the requirement ID being tested (e.g. **FR-MA-CORE-01**)
- Tests MUST be runnable via `npm test` or equivalent
- Test files MUST be committed to the repository
- All edge cases MUST be covered (e.g. null inputs, invalid paths, error states)
- At least one integration test MUST be implemented in sim mode
- On user request via argument `syst`, a system test (e.g. for interaction without sim) MUST be executed

## Example

```markdown
### Testing
- [x] **FR-TEST-01** Sim mode for testing without consuming tokens
- [x] **FR-TEST-02** Dummy responses based on system prompt and requirements
- [x] **FR-TEST-03** In your tests reference the core requirement id you test with e.g. **FR-MA-CORE-01**
- [x] **FR-TEST-04** Crosscheck if 99% of requi in folder v1/requi are covered.
```

## Rationale

- Ensures all requirements are verifiable
- Prevents implementation drift
- Provides living documentation
- Enables automated requirement coverage analysis

---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.04.00 | 2026-06-04 | ai(cline) | Add syst argument for system test on user request |
| V00.03.00 | 2026-06-04 | ai(cline) | Add system test on user request requirement |
| V00.02.00 | 2026-06-04 | ai(cline) | Add edge case and integration test requirements |
| V00.01.00 | 2026-06-04 | ai(cline) | Initial implementation |