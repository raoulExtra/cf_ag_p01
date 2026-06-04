# Functional Requirements
> Version: V00.01.00

See [v1/requi/functional-requirements.md](v1/requi/functional-requirements.md) for base requirements (FR-MA-*).

## v2 Additional Requirements

### Explain folder v2/explain
- [ ] **V2-EXPLAIN-01** explain for simulate Durable Objects with local filesystem 

### Storage Backend (Configurable)
- [x] **V2-STORAGE-01** BaseAgent option "dur" to use Durable Objects instead of R2
- [x] **V2-STORAGE-02** In sim mode, simulate Durable Objects with local filesystem
- [x] **V2-STORAGE-03** R2 mode: default, uses R2 bucket

### Testing
- [x] **V2-TEST-01** Sim mode testing for Durable Objects simulation
- [x] **V2-TEST-02** Test V2-STORAGE requirements via integration tests
- [x] **V2-TEST-03** Reference V2 requirements: **V2-STORAGE-01**, **V2-STORAGE-02**, **V2-STORAGE-03**

### Test
- [x] **TEST-V2-01** Integration tests for Durable Objects simulation in src/tests/integration/durable-objects-sim.test.ts
- [x] **TEST-V2-02** Reference v2 requirements: **V2-STORAGE-01**, **V2-STORAGE-02**, **V2-STORAGE-03**

### Deployment
- [x] **V2-DEPLOY-01** Storage binding (R2 or Durable Objects)
- [x] **V2-DEPLOY-02** AI binding

---

## Change History

See [conventions/72_conv_change_history_for_code.md](conventions/72_conv_change_history_for_code.md) for code change history conventions.

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.05.00 | 2026-06-04 | ai(cline) | Fix testing requirements and add missing test |
| V00.02.00 | 2026-06-04 | ai(cline) | Add Test chapter per testing convention |
| V00.01.00 | 2026-05-25 | peter | Initial publication |