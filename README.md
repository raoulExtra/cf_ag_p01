# Multi-Agent System on Cloudflare Workers

Phase 1 demonstrates multi-agent conventions: code has `getVersion()` and Change History per `conventions/72_conv_change_history_for_code.md`, requirements have `### Test` chapters with TDD in `src/tests/`, and edge cases are covered per `conventions/75_conv_testing_requirements.md`.

Two AI agents communicate via R2 file storage and work in parallel. Built with Cloudflare Wrangler, agents run in isolated Durable Objects, use R2 for file storage and KV for atomic state operations.

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

# Development
npm run dev

# Deploy
npx wrangler deploy

# Chat with Agent 1
curl -X POST https://multi-agent.workers.dev/agent1 \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## Communication

Agents communicate via R2 paths:
- `/shared/agent1-input.txt` - Messages for Agent 1
- `/shared/agent2-input.txt` - Messages for Agent 2
- `/shared/kv/` - Shared state (counters, flags, etc.)