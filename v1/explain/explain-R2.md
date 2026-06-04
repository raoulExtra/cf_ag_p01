# R2 Storage Explanation

## Overview
R2 is Cloudflare's S3-compatible object storage service. It's used in this project for file-based coordination between agents.

## Configuration
- **Bucket**: FILES (R2 bucket defined in wrangler.jsonc)
- **Bindings**: Accessed via `TOOLS.r2` in the agent code

## Files Structure
```
FILES/
├── shared/
│   ├── agent1-input.txt
│   ├── agent2-input.txt
│   └── state.json
└── tasks/
    ├── task-1.json
    └── task-2.json
```

## Key Use Cases

### 1. Agent Communication
Agents communicate via shared files:
- `agent1-input.txt` - messages for Agent1
- `agent2-input.txt` - messages for Agent2

### 2. Task Persistence
Tasks are stored as JSON files with:
- Task ID, description, status
- Delay/scheduling information
- Retry logic

### 3. State Tracking
KV-style counters stored as files:
- `state.json` with atomic single-key writes
- Used for coordination without race conditions

## Operations
- `get()` - Read file contents
- `put()` - Write/update file
- `delete()` - Remove file
- `list()` - List directory contents

## Consistency Notes
- R2 operations are **strongly consistent** globally
  - Reads, writes, deletes, and list operations see the latest state immediately
  - No propagation delays for object operations
- Exception: IAM permission changes are eventually consistent (up to 1 minute)
- Exception: Cache can affect consistency for publicly accessible objects via custom domains
- Use atomic single-key writes for counters (still good practice)
- Durable Objects provide even stronger guarantees for complex coordination if needed