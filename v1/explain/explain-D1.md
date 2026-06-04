# D1 Database Explanation

## Overview
D1 is Cloudflare's managed SQLite-like database service. It provides serverless SQL access with global replication and low-latency queries.

## Key Features
- **Serverless**: No infrastructure management required
- **Global**: Deployed alongside Workers for low-latency access
- **SQLite-compatible**: Standard SQL syntax with some limitations
- **Free tier**: Generous limits included in Workers plan

## Configuration
- **Binding**: Accessed via `DB` binding in wrangler.jsonc
- **Database**: Created and managed automatically via `wrangler d1` commands

## Use Cases
- Structured data storage (users, sessions, configurations)
- Query-based access patterns
- Relational data with joins
- Transactions and ACID compliance

## Limitations
- No full-text search (FTS5 available)
- Limited data types compared to PostgreSQL/MySQL
- No stored procedures or triggers
- Max 1GB per database on free tier

## Comparison with R2
| Feature | D1 | R2 |
|---------|-----|-----|
| Data Model | Relational (SQL) | Object storage (files) |
| Consistency | Strong | Eventual |
| Query | SQL | Key-based |
| Use Case | Structured data | Unstructured files |