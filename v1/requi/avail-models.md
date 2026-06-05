# Available Models

This document lists available AI models for use with the agent system.

## Cloudflare Workers AI Models

### Llama Series
- `@cf/meta/llama-3.2-1b-instruct` - Default model, efficient for chat
- `@cf/meta/llama-3.1-8b-instruct` - More capable, higher quality

### Granite Series (IBM)
- `@cf/ibm-granite/granite-4.0-h-micro` - Supports tool calling, small and efficient

### Tool Calling Support
The following models support tool calling:
- `@cf/ibm-granite/granite-4.0-h-micro`

## Model Usage

Models can be changed via:
1. Constructor parameter `modelId`
2. `setModel(modelId)` method on agent

## Example

```typescript
const agent = new CustomAgent("Agent1", "/shared/input.txt", "/shared/output.txt");
agent.setModel("@cf/ibm-granite/granite-4.0-h-micro");
```