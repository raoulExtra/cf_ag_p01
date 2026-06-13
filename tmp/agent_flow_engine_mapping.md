# Agent Flow Engine Mapping

This document maps prominent agent orchestration concepts to a lightweight, YAML-friendly flow engine model.

## 1. Proposed Core Model

```yaml
flow:
  id: variants_compete
  name: "Variants Compete"
  start_state: generate_variants

  context:
    variants: []
    comparisons: []
    winner: null

  states:
    - name: generate_variants
      on_enter:
        - actor: generator
      transitions:
        - to: compare_variants
          when: variants_ready

    - name: compare_variants
      on_enter:
        - actor: critic
      transitions:
        - to: select_winner
          when: comparisons_done

    - name: select_winner
      on_enter:
        - actor: judge
      transitions:
        - to: complete
          when: winner_selected
```

## 2. Core Vocabulary

| Our Flow Engine | Meaning | Notes |
|---|---|---|
| `flow` | Whole workflow definition | Static, reusable structure. |
| `state` | Current phase or task | Prefer meaningful names like `generate_plan`, `review_plan`, `select_winner`. |
| `start_state` | Entry point | First state executed. |
| `on_enter` | Actions triggered when entering a state | Can call executors, actors, logs, validators, guards. |
| `actor` | Role-level performer | Example: `planner`, `critic`, `judge`, `analyst`. |
| `executor` | Concrete implementation | Example: Python function, LLM call, shell command, service call. |
| `role` | Behavioral perspective | Useful when actor can be an agent. |
| `context` | Runtime data / payload | Holds variants, comparisons, counters, queue, result, errors. |
| `transition` | Route to another state | Equivalent to an edge. |
| `when` | Guard / condition | Evaluated after state action completes. |
| `complete` | Terminal state | Could also be `completed`, `failed`, `cancelled`. |

## 3. Mapping to LangGraph

LangGraph models workflows as graphs with three central pieces: shared `State`, `Nodes` that execute logic and update state, and `Edges` that route to the next node. Conditional edges can branch, and multiple outgoing edges may run in parallel in the next super-step. LangGraph also supports `Send` objects for map-reduce style fan-out. Sources: LangGraph Graph API overview and LangGraph.js StateGraph reference.

| LangGraph | Our Flow Engine | Mapping |
|---|---|---|
| `State` | `context` | Shared runtime payload. |
| State schema | Context schema | Defines allowed keys such as `variants`, `winner`, `boot_count`. |
| Node | State `on_enter` action | A node function maps well to an executor/actor call. |
| Edge | `transition` | Static route from one state to another. |
| Conditional edge | `when` guard | Runtime decision after action. |
| Entry point | `start_state` | First state/node. |
| Reducer | Context merge policy | Needed when parallel branches update the same context key. |
| `Send` | Dynamic fan-out | Useful for “multiple tracks, then merge”. |
| Super-step | Parallel cycle | Useful if the engine supports parallel branches. |

Recommended adaptation:

```yaml
context_schema:
  variants: list
  comparisons: list
  winner: optional

merge:
  comparisons: append
  winner: last_write_wins
```

## 4. Mapping to CrewAI

CrewAI emphasizes agents, crews, tasks, processes, and flows. Its docs describe agents with tools, memory, knowledge, and structured outputs; flows can orchestrate start/listen/router steps, manage state, persist execution, and resume long-running workflows. Sources: CrewAI documentation index and getting-started docs.

| CrewAI | Our Flow Engine | Mapping |
|---|---|---|
| Agent | `actor` / `role` | Specialized helper such as planner, researcher, critic. |
| Task | State name or inferred task | Prefer `state.name` as the task when possible. |
| Crew | Group of actors | Could be declared under `actors`. |
| Process | Flow strategy | Sequential, hierarchical, hybrid maps to transition topology. |
| Flow | `flow` | High-level orchestration. |
| Router step | Conditional transition | `when` plus condition evaluator. |
| Guardrail | `validator` / `guard` | Pre/post condition around actor/executor. |
| Memory / Knowledge | Context or external resource | Should usually not be embedded directly in state definition. |
| Human-in-the-loop | `awaiting_human` state | Explicit pause state. |

Recommended adaptation:

```yaml
actors:
  planner:
    type: agent
    role: planner
  critic:
    type: agent
    role: critic
  judge:
    type: agent
    role: judge
```

## 5. Mapping to Microsoft AutoGen

AutoGen AgentChat describes teams as groups of agents that work together toward a common goal. It includes team presets such as `RoundRobinGroupChat`, `SelectorGroupChat`, `MagenticOneGroupChat`, and `Swarm`; `Swarm` uses handoff messages to signal transitions between agents. Source: Microsoft AutoGen Teams documentation.

| AutoGen | Our Flow Engine | Mapping |
|---|---|---|
| AssistantAgent | `actor` | Agent implementation. |
| Team | Actor group / flow participants | A collection of actors available to the flow. |
| RoundRobinGroupChat | Cyclic transition | Useful for review loops. |
| SelectorGroupChat | Dynamic actor selection | Equivalent to routing by guard/selector. |
| Swarm | Handoff-based flow | Maps to transitions between actor-owned states. |
| HandoffMessage | Transition event | A signal to move control to another actor/state. |
| Termination condition | Stop condition | Maps to `when: done`, `max_cycles`, `complete`. |
| Shared context | `context` | Conversation/state visible to agents. |

Recommended adaptation:

```yaml
limits:
  max_cycles: 6

states:
  - name: review_answer
    on_enter:
      - actor: critic
    transitions:
      - to: revise_answer
        when: revision_required
      - to: complete
        when: accepted
```

## 6. Mapping to OpenAI Agents SDK

The OpenAI Agents SDK centers on agents, tools, handoffs, and guardrails. Handoffs let one agent delegate to another specialized agent and are represented to the model as tool-like calls. Guardrails can validate input or output, and tool guardrails can wrap every custom tool invocation. Sources: OpenAI Agents SDK handoffs and guardrails docs.

| OpenAI Agents SDK | Our Flow Engine | Mapping |
|---|---|---|
| Agent | `actor` | LLM-backed performer. |
| Instructions | Role prompt / actor config | Belongs in actor definition, not repeated in every state. |
| Tool | `executor` | Function or capability callable by an agent. |
| Handoff | Transition / delegation | Move from one actor-owned state to another. |
| Handoff input filter | Context projection | Controls which context keys are passed onward. |
| Input guardrail | Precondition | Validate before first state/agent. |
| Output guardrail | Final validator | Validate terminal result. |
| Tool guardrail | Executor pre/post validator | Wraps executor calls. |
| Runner/run | Flow runtime | Executes flow instance. |
| Final output | Terminal context result | Usually `context.result` or `context.winner`. |

Recommended adaptation:

```yaml
validators:
  before_flow:
    - validate_input
  after_executor:
    - validate_tool_output
  before_complete:
    - validate_final_answer
```

## 7. Unified Mapping Table

| General Concept | LangGraph | CrewAI | AutoGen | OpenAI Agents SDK | Our Flow Engine |
|---|---|---|---|---|---|
| Workflow | Graph | Flow / Crew | Team / workflow | Runner orchestration | `flow` |
| Step | Node | Task / step | Agent turn | Agent/tool call | `state` + `on_enter` |
| Shared data | State | Flow state / memory | Shared context | Run context/items | `context` |
| Routing | Edge | Router/listen | Selector/handoff | Handoff | `transition` |
| Condition | Conditional edge | Router condition | Termination/selector | Guardrail/handoff choice | `when` |
| Worker | Node function | Agent | AssistantAgent | Agent | `actor` |
| Tool/function | Node/tool | Tool | Tool | Tool | `executor` |
| Perspective | Prompt/config | Role/goal/backstory | Agent description | Instructions | `role` |
| Safety check | Reducer/validator custom | Guardrail | Termination/control logic | Guardrail | `guard` / `validator` |
| Loop limit | Recursion limit / state | Flow state | Termination condition | Max turns/custom control | `max_cycles`, `boot_count` |
| Parallel fan-out | Send / parallel edges | Crews/tasks | Group chat/team | Multiple agents/tools | parallel transitions / spawned states |
| Merge | Reducer | Aggregation task | Conversation synthesis | Final agent/tool output | context merge policy |

## 8. Design Recommendation

Use this minimal rule set:

```text
flow      = static workflow definition
state     = meaningful task or phase
actor     = who performs the state
executor  = concrete implementation detail
context   = runtime payload
transition = routing rule
when      = condition/guard
validator = safety or quality check
```

Prefer:

```yaml
- name: classify_customer_feedback
  on_enter:
    - actor: analyst
```

Over:

```yaml
- name: processing
  on_enter:
    - actor: analyst
      task: classify_customer_feedback
```

Reason: if the task uniquely defines the purpose of the state, the state name should carry that meaning.

## 9. Lightweight Flow Skeleton

```yaml
flow:
  id: lightweight_agent_flow
  name: "Lightweight Agent Flow"
  start_state: bootstrapping

  context:
    boot_count: 0
    cycle_count: 0
    result: null
    errors: []

  actors:
    planner:
      type: agent
      role: planner
    critic:
      type: agent
      role: critic
    judge:
      type: agent
      role: judge

  states:
    - name: bootstrapping
      on_enter:
        - executor: initialize_system
      transitions:
        - to: generate_plan
          when: bootstrap_verified
        - to: failed
          when: bootstrap_failed

    - name: generate_plan
      on_enter:
        - actor: planner
      transitions:
        - to: review_plan
          when: plan_ready

    - name: review_plan
      on_enter:
        - actor: critic
      transitions:
        - to: generate_plan
          when: revision_required
        - to: complete
          when: accepted

    - name: complete
      terminal: true

    - name: failed
      terminal: true
```

## 10. Practical Naming Conventions

| Use Case | Recommended Name |
|---|---|
| Startup in progress | `bootstrapping` |
| Startup completed | `bootstrapped` or `ready` |
| Planning in progress | `planning` or `generate_plan` |
| Planning completed | `planned` |
| Review in progress | `review_plan` |
| Successful terminal state | `complete` / `completed` |
| Failed terminal state | `failed` |
| Bootstrap counter | `boot_count` or `bootstrap_count` |
| Loop counter | `cycle_count` |
| Retry counter | `retry_count` |
| Recursion depth | `recursion_depth` |

## 11. Minimal Implementation Principle

The flow engine should not need to know whether an actor is implemented by Python code, an LLM agent, a shell command, or an external service.

Keep the flow declarative:

```yaml
- name: review_plan
  on_enter:
    - actor: critic
```

Let the runtime resolve implementation:

```text
critic -> OpenAI agent
critic -> local Python function
critic -> remote service
critic -> human reviewer
```

That keeps the design language-independent and implementation-independent.
