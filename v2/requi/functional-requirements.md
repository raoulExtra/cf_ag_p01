# Functional Requirements
> Version: V00.15.00

See [v1/requi/functional-requirements.md](v1/requi/functional-requirements.md) for base requirements (FR-MA-*).

## v2 Additional Requirements

### Explain folder v2/explain
- [x] **V2-EXPLAIN-01** explain for simulate Durable Objects with local filesystem 

### Version Separation
- [x] **V2-VERS_SEPA-01** all ts code for v2 requi expansion go to \v2\src and to compareable folders like src/v1
- [x] **V2-VERS_SEPA-02** we make sure that v1 stays as minimal as possible and all v2 expansion have a efficient oo structure
- [x] **V2-VERS_SEPA-03** same is valid for the sources in context of testing
- [x] **V2-VERS_SEPA-04** Version separation is wrong if \v2\src is not filled with v2 requirements implementation
- [x] **V2-VERS_SEPA-05** When simMode=false, use Durable Objects instead of R2 for KV store
- [x] **V2-VERS_SEPA-06** v2/src/agents/v2-base-agent.ts is the new base agent when simMode=false, v1/src/agents/custom-agent.ts uses it to keep agent1/2 stable
- [x] **V2-VERS_SEPA-07** FR-NF-05 v2 argument to use v2-base-agent.ts when simMode=false

### Storage Backend (Configurable)
- [x] **V2-STORAGE-01** BaseAgent option "dur" to use Durable Objects instead of R2
- [x] **V2-STORAGE-02** In sim mode, simulate Durable Objects with local filesystem
- [x] **V2-STORAGE-03** R2 mode: default, uses R2 bucket

### Testing
- [x] **V2-TEST-01** Sim mode testing for Durable Objects simulation
- [x] **V2-TEST-02** Test V2-STORAGE requirements via integration tests
- [x] **V2-TEST-03** Reference V2 requirements: **V2-STORAGE-01**, **V2-STORAGE-02**, **V2-STORAGE-03**
- [x] **V2-TEST-04** Test V2-VERS_SEPA requirements in src/tests/version-separation.test.ts
- [x] **V2-TEST-05** Test V2-VERS_SEPA-01 directory structure in src/tests/version-separation.test.ts
- [x] **V2-TEST-06** Test V2-VERS_SEPA-03 testing structure in src/tests/version-separation.test.ts
- [x] **V2-TEST-07** Test V2-VERS_SEPA-04 v2/src implementation in src/tests/version-separation.test.ts
- [x] **V2-TEST-08** Test V2-VERS_SEPA-05 Durable Objects vs R2 in src/tests/durable-objects.test.ts
- [x] **V2-TEST-09** Test V2-VERS_SEPA-07 v2-base-agent.ts integration in src/tests/v2-integration.test.ts

### Test
- [x] **TEST-V2-01** Integration tests for Durable Objects simulation in src/tests/integration/durable-objects-sim.test.ts
- [x] **TEST-V2-02** Reference v2 requirements: **V2-STORAGE-01**, **V2-STORAGE-02**, **V2-STORAGE-03**
- [x] **TEST-V2-03** Test version separation in src/tests/version-separation.test.ts
- [x] **TEST-V2-04** Test V2-VERS_SEPA-01 directory structure
- [x] **TEST-V2-05** Test V2-VERS_SEPA-03 testing structure
- [x] **TEST-V2-06** Test V2-VERS_SEPA-04 v2/src implementation
- [x] **TEST-V2-07** Test V2-VERS_SEPA-05 Durable Objects vs R2
- [x] **TEST-V2-08** Test V2-VERS_SEPA-06 v2-base-agent.ts

### Deployment
- [x] **V2-DEPLOY-01** Storage binding (R2 or Durable Objects)
- [x] **V2-DEPLOY-02** AI binding

---

## Change History

See [conventions/72_conv_change_history_for_code.md](conventions/72_conv_change_history_for_code.md) for code change history conventions.

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.15.00 | 2026-06-04 | ai(cline) | Complete all V2 requirements |
| V00.14.00 | 2026-06-04 | ai(cline) | Add V2-VERS_SEPA-07 FR-NF-05 integration |
| V00.13.00 | 2026-06-04 | ai(cline) | Add V2-VERS_SEPA-06 v2-base-agent.ts |
| V00.12.00 | 2026-06-04 | ai(cline) | Complete all V2 requirements including V2-VERS_SEPA-04 |
| V00.11.00 | 2026-06-04 | ai(cline) | Add V2-VERS_SEPA-04 requirement for v2/src implementation |
| V00.10.00 | 2026-06-04 | ai(cline) | Complete all V2 requirements |
| V00.09.00 | 2026-06-04 | ai(cline) | Add V2-VERS_SEPA-03 and fix duplicate IDs |
| V00.08.00 | 2026-06-04 | ai(cline) | Implement V2 version separation requirements |
| V00.07.00 | 2026-06-04 | ai(cline) | Add V2-VERS_SEPA requirements and tests |
| V00.06.00 | 2026-06-04 | ai(cline) | Add sim filesystem explanation |
| V00.05.00 | 2026-06-04 | ai(cline) | Fix testing requirements and add missing test |
| V00.02.00 | 2026-06-04 | ai(cline) | Add Test chapter per testing convention |
| V00.01.00 | 2026-05-25 | peter | Initial publication |