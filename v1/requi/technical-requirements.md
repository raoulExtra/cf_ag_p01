# Technical Requirements

## Stack
- **TR-STACK-01** TypeScript 5.x
- **TR-STACK-02** Cloudflare Workers (Node.js compatible)
- **TR-STACK-03** Workers AI (configurable model, default: @cf/meta/llama-3.2-1b-instruct)
- **TR-STACK-04** Durable Objects (Agent1, Agent2)
- **TR-STACK-05** R2 Storage (FILES bucket)

## Dependencies
```json
{
  "agents": "^0.14.0",
  "@cloudflare/ai-chat": "^0.8.0",
  "workers-ai-provider": "^3.1.14",
  "ai": "^6.0.194",
  "zod": "^4.4.3"
}
```

## Architecture
```
Client → Worker Entry → routeAgentRequest → Durable Object
                                    │
                                    └── AIChatAgent → Workers AI
                                    │
                                    └── Tools → R2 (files + KV)
```

## Configuration (wrangler.jsonc)
- **TR-CONFIG-01** 2 Durable Object classes (Agent1, Agent2)
- **TR-CONFIG-02** 1 R2 bucket (FILES)
- **TR-CONFIG-03** 1 AI binding
- **TR-CONFIG-04** nodejs_compat flag

## Concurrency Model
- **TR-CONCURRENCY-01** Each agent = 1 Durable Object instance
- **TR-CONCURRENCY-02** R2 operations = strongly consistent globally
- **TR-CONCURRENCY-03** KV counters = atomic via single-key writes