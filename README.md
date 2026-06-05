# Multi-Agent System on Cloudflare Workers

Phase 1 demonstrates multi-agent functionality. Two AI agents communicate via R2 file storage and work in parallel. Built with Cloudflare Wrangler, agents run in isolated Durable Objects, use R2 for file storage and KV for atomic state operations.

## Content Info
conventions: code has `getVersion()` and Change History per `conventions/20_conv_change_history_for_code.md`, requirements have `### Test` chapters with TDD in `src/tests/`, and edge cases are covered per `conventions/30_conv_testing_requirements.md`.

## Testing
- `npm test` - Run all tests (82 tests, 100% coverage)
- Tests verify requirements in `v1/requi/functional-requirements.md`
- v2 tests in `v2/requi/functional-requirements.md`

### Test Structure
- `src/tests/unit/` - Unit tests for agents
- `src/tests/integration/` - Integration tests for file/KV operations
- `src/tests/simulation/` - Multi-agent simulation tests
- `src/tests/demo.test.ts` - Demo module tests

## Structure

```
src/
├── agents/
│   ├── base-agent.ts  # Shared agent logic
│   ├── agent1.ts      # Agent 1 with scheduling
│   └── agent2.ts      # Agent 2 with scheduling
├── shared/
│   ├── file-tools.ts  # R2 file operations
│   └── kv-store.ts    # Atomic key-value store
└── index.ts           # Entry point
```

## Features

- **Parallel execution**: Each agent runs in its own Durable Object
- **Non-blocking coordination**: R2 file storage + atomic KV operations
- **Task scheduling**: Agents can schedule tasks for each other
- **Free tier**: Uses Workers AI (10,000 Neurons/day free)
- **Low-cost models**: Default `@cf/meta/llama-3.2-1b-instruct` (~2.4k neurons/M tokens)

## Usage

```bash
# Install dependencies
npm install

# Development (sim mode - no tokens consumed)
npm run dev

# Deploy to production
npx wrangler deploy

# Chat with Agent 1
curl -X POST https://multi-agent.workers.dev/agent1 \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

### Running Modes

| Mode | Description |
|------|-------------|
| Sim Mode (default) | Tests without consuming tokens, uses dummy responses |
| Production Mode | Uses real Workers AI, requires AI binding |

### v1 vs v2

| | v1 | v2 |
|---|---|---|
| Storage | R2 bucket (`env.FILES`) | R2 bucket (`env.FILES`) |
| KV Store | R2-backed | R2-backed (planned: Durable Objects) |
| Default | `simMode=true` | `simMode=true` |

**Note:** v2 has planned Durable Objects support for production mode (see `V2-STORAGE-04` in `v2/requi/functional-requirements.md`).

### Documentation

- [D1 Database Explanation](v1/explain/explain-D1.md) - SQLite-like database for structured data
- [R2 Storage Explanation](v1/explain/explain-R2.md) - Object storage for files
- [Available Models](v1/requi/avail_models.md) - AI models supported

### Streamlined API Setup

For a quick production setup, add these bindings to `wrangler.jsonc`:

```json
{
  "bindings": [
    { "name": "AI", "type": "ai" },
    { "name": "FILES", "type": "r2", "bucket_name": "your-bucket" },
    { "name": "AGENTS_DO", "type": "durable_object", "class_name": "Agent", "script_name": "multi-agent" }
  ]
}
```

## Communication

Agents communicate via R2 paths:
- `/shared/agent1-input.txt` - Messages for Agent 1
- `/shared/agent2-input.txt` - Messages for Agent 2
- `/shared/kv/` - Shared state (counters, flags, etc.)