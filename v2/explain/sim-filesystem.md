# Simulating Durable Objects with Local Filesystem

## Overview

This document explains how Durable Objects are simulated using local filesystem in test mode.

## Approach

Instead of deploying to Cloudflare's Durable Objects, we use a local R2 bucket simulation:

1. **In-memory storage**: Use local filesystem or in-memory objects
2. **Path mapping**: Map DO IDs to local file paths
3. **Isolation**: Each "DO" gets its own directory

## Implementation

```typescript
// In sim mode, KVStore uses local filesystem
const simMode = true;
const storagePath = "/tmp/sim-do-storage/";
```

## Benefits

- No deployment needed for testing
- Fast iteration
- No token consumption
- Reproducible tests

## Limitations

- Does not perfectly replicate DO behavior
- No cross-worker atomicity guarantees
- Latency simulation only

## Configuration

Set `simMode: true` in BaseAgent constructor or via `setSimMode()`.