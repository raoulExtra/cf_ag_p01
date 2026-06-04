# Available Workers AI Models (Low Neuron Consumption)

## Text Generation Models

| Model | Neurons/M Input | Neurons/M Output | Notes |
|-------|-----------------|------------------|-------|
| `@cf/moonshotai/kimi-k2.6` | ~3,000 | ~4,000 | Default in BaseAgent |
| `@cf/ibm-granite/granite-4.0-h-micro` | 1,542 | 10,158 | **Supports tool calling** - 3B params, smallest |
| `@cf/meta/llama-3.2-1b-instruct` | 2,457 | 18,252 | Good for agents |
| `@cf/qwen/qwen3-30b-a3b-fp8` | 4,625 | 30,475 | Efficient 30B |
| `@cf/mistral/mistral-7b-instruct-v0.1` | 10,000 | 17,300 | 7B parameter |

## Ultra-Cheap Embeddings

| Model | Neurons/M Input | Use Case |
|-------|-----------------|----------|
| `@cf/baai/bge-reranker-base` | 283 | Text ranking |
| `@cf/baai/bge-m3` | 1,075 | General embeddings |
| `@cf/baai/bge-small-en-v1.5` | 1,841 | Small embeddings |
| `@cf/baai/bge-base-en-v1.5` | 6,058 | Medium embeddings |

## Usage in Code

```typescript
// Default model in BaseAgent
const result = await streamText({
  model: workersai("@cf/meta/llama-3.2-1b-instruct"), // default
  // ...
});

// Or use kimi-k2.6
const result = await streamText({
  model: workersai("@cf/moonshotai/kimi-k2.6"),
  // ...
});

// Or switch models dynamically
agent.setModel("@cf/ibm-granite/granite-4.0-h-micro");
```

## Free Tier Budget

- **10,000 Neurons/day** free
- With 1B model: ~4,000 queries/day (10k / 2.5k)
- With embeddings: ~9,300 queries/day (10k / 1.075k)