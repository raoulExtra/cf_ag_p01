# ChatGPT shared chat summary

Source: https://chatgpt.com/share/6a2bf97f-b838-83eb-877d-956f56553c96

## Summary
The chat discussed how to design a lightweight YAML-based flow engine for agent workflows.

## Main points
- Use **state names** as the task/purpose, e.g. `classify_customer_feedback`.
- Use **role/actor** to describe who performs the task, e.g. `analyst`, `critic`, `judge`.
- Keep the **executor** as a runtime implementation detail.
- Prefer explicit workflow states and transitions over generic repeated names like `processing`.

## Tools mentioned
- **LangGraph**: main inspiration for explicit state/graph control.
- **CrewAI**: role-oriented collaboration workflows.
- **AutoGen**: conversation-centric multi-agent collaboration.
- **OpenAI Agents SDK**: lighter orchestration with tools, handoffs, and guardrails.

## Outcome
The assistant offered to create a Markdown mapping file connecting concepts from these tools to the custom flow engine, and reported that `agent_flow_engine_mapping.md` was created.
