# Agent Interaction Demo

## Initial State
Both agents start with no knowledge of each other's names.

## Interaction Flow

### Step 1: Agent 1 introduces itself
**User to Agent 1:**
```
Hello! What's your name?
```

**Agent 1 response:**
```
Hi there! I'm Agent 1. Nice to meet you!
```

### Step 2: Agent 1 discovers Agent 2
**Agent 1 to /shared/agent2-input.txt:**
```
Hello Agent 2! I'm Agent 1. What's your name?
```

### Step 3: Agent 2 responds
**Agent 2 reads /shared/agent2-input.txt and responds:**
```
Hi Agent 1! I'm Agent 2. Nice to meet you too!
```

### Step 4: Agent 2 writes back to Agent 1
**Agent 2 writes to /shared/agent1-input.txt:**
```
This is Agent 2 signing off. Talk soon!
```

### Step 5: Agent 1 receives the greeting
**Agent 1 reads /shared/agent1-input.txt:**
```
Hello from Agent 2! I'm ready to collaborate.
```

## Expected Console Output

```
Agent 1: Hello! What's your name?
Agent 1: Hi there! I'm Agent 1. Nice to meet you!

[Agent 1 writes to /shared/agent2-input.txt]
Agent 1: Hello Agent 2! I'm Agent 1. What's your name?

[Agent 2 reads /shared/agent2-input.txt]
Agent 2: Hi Agent 1! I'm Agent 2. Nice to meet you too!

[Agent 2 writes to /shared/agent1-input.txt]
Agent 2: Hello from Agent 2! I'm ready to collaborate.

[Agent 1 reads /shared/agent1-input.txt]
Agent 1: Hello from Agent 2! I'm ready to collaborate.
```

## Test Commands

```bash
# Start conversation with Agent 1
curl -X POST https://multi-agent.workers.dev/agent1 \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello! What is your name?"}]}'

# Agent 1 will greet and ask Agent 2 for its name

# Check Agent 2's response
curl -X POST https://multi-agent.workers.dev/agent2 \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is your name?"}]}'
```