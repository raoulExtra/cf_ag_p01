# Functional Requirements
> Version: V00.01.00

## Multi-Agent System

### Core Capabilities
- [x] **FR-MA-CORE-01** Two AI agents (Agent1, Agent2) running in parallel
- [x] **FR-MA-CORE-02** Be as efficient as possible (low neuron consumption)
- [x] **FR-MA-CORE-03** Besides textual systemprompt have an equivalent json variant of it.
- [x] **FR-MA-CORE-04** Each agent has a role in the systemprompt which can change
- [x] **FR-MA-CORE-05** Have a custom-agent on level 2 that extends BaseAgent on level 1
  - CustomAgent provides shared functionality (e.g. scheduling, counters, model switching)
  - Agent1 extends CustomAgent for partner communication
  - Agent2 extends CustomAgent with different default model
- [x] **FR-MA-CORE-06** Each agent in separate Durable Object for isolation
- [x] **FR-MA-CORE-07** Shared R2 file storage for coordination
- [x] **FR-MA-CORE-08** Atomic KV operations for non-blocking state
- [x] **FR-MA-CORE-09** Always introduce yourself by name & current role
- [x] **FR-MA-CORE-10** Agents work short and precise. Example: greetings ("Here Agent 1 in role collaborator.")

### Communication
- [x] **FR-MA-COMM-01** Agent1 ↔ Agent2 message passing via `/shared/agent{1,2}-input.txt`
- [x] **FR-MA-COMM-02** Task scheduling between agents
- [x] **FR-MA-COMM-03** Shared counters for state tracking

### File Operations
- [x] **FR-MA-FILE-01** Read files from storage
- [x] **FR-MA-FILE-02** Write files to storage
- [x] **FR-MA-FILE-03** Edit files in storage
- [x] **FR-MA-FILE-04** List directory contents

### Storage Backend (Configurable)
- [x] **FR-MA-STORAGE-01** BaseAgent option "dur" to use Durable Objects instead of R2
- [x] **FR-MA-STORAGE-02** In sim mode, simulate Durable Objects with local filesystem
- [x] **FR-MA-STORAGE-03** R2 mode: default, uses R2 bucket
- [x] **FR-MA-STORAGE-04** Durable Objects mode: uses Durable Objects for state

### Scheduling
- [x] **FR-MA-SCHED-01** Delay-based task execution
- [x] **FR-MA-SCHED-02** Idempotent task handling
- [x] **FR-MA-SCHED-03** Task persistence in storage

### AI Model
- [x] **FR-MA-AI-01** Workers AI integration
- [x] **FR-MA-AI-02** Configurable model per agent via `setModel()`
- [x] **FR-MA-AI-03** Default model for BaseAgent is `@cf/meta/llama-3.2-1b-instruct` (2.4k neurons/M)
- [x] **FR-MA-AI-04** Agent1 & Agent2 use same default model at start
- [x] **FR-MA-AI-05** Agent1 & Agent2 can use different models (e.g.'@cf/ibm-granite/granite-4.0-h-micro')
- [x] **FR-MA-AI-06** Free tier (10,000 Neurons/day)
- [x] **FR-MA-AI-07** Model configurable via constructor and `setModel()` method
- [x] **FR-MA-AI-08** See v1/requi/avail_models.md for available models
- [x] **FR-MA-AI-09** `@cf/ibm-granite/granite-4.0-h-micro` supports tool calling

### Deployment
- [x] **FR-MA-DEPLOY-01** Wrangler configuration
- [x] **FR-MA-DEPLOY-02** Durable Objects setup
- [x] **FR-MA-DEPLOY-03** Storage binding (R2 or Durable Objects)
- [x] **FR-MA-DEPLOY-04** AI binding

## API Endpoints
- `GET /` - Status page
- `POST /agent1` - Chat with Agent 1
- `POST /agent2` - Chat with Agent 2

## Non-Functional
- [x] **FR-NF-01** Non-blocking file operations
- [x] **FR-NF-02** Concurrent agent execution
- [x] **FR-NF-03** Atomic counter increments
- [x] **FR-NF-04** Message persistence

## Testing
- [x] **FR-TEST-01** Sim mode for testing without consuming tokens
- [x] **FR-TEST-02** Dummy responses based on system prompt and requirements
- [x] **FR-TEST-03** In your tests reference the core requirement id you test with e.g. **FR-MA-CORE-01**
- [x] **FR-TEST-04** Crosscheck if 99% of requi in folder v1/requi are covered.

### Test
- [x] **TEST-CORE-01** Unit tests for BaseAgent in src/tests/unit/base-agent.test.ts
- [x] **TEST-CORE-02** Unit tests for CustomAgent in src/tests/unit/custom-agent.test.ts
- [x] **TEST-CORE-03** Unit tests for Agent1/Agent2 in src/tests/unit/agents.test.ts
- [x] **TEST-CORE-04** Integration tests for file operations in src/tests/integration/file-tools.test.ts
- [x] **TEST-CORE-05** Integration tests for KV store in src/tests/integration/kv-store.test.ts
- [x] **TEST-CORE-06** Simulation tests for multi-agent coordination in src/tests/simulation/multi-agent-sim.test.ts
- [x] **TEST-CORE-07** Reference core requirements: **FR-MA-CORE-01**, **FR-MA-CORE-02**, **FR-MA-CORE-03**
- [x] **TEST-CORE-08** System test via `syst` argument for interaction without sim

---

## Change History

See [conventions/72_conv_change_history_for_code.md](conventions/72_conv_change_history_for_code.md) for code change history conventions.

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.05.00 | 2026-06-04 | ai(cline) | Add syst system test requirement |
| V00.04.00 | 2026-06-04 | ai(cline) | Add comprehensive tests per testing convention |
| V00.03.00 | 2026-06-04 | ai(cline) | Add Test chapter per testing convention |
| V00.02.00 | 2026-06-04 | ai(cline) | Apply versioning conventions |
| V00.01.00 | 2026-05-25 | peter | Initial publication |
