import { BaseAgent } from "./base-agent";
import { tool } from "ai";
import { z } from "zod";

export class CustomAgent extends BaseAgent {
  static getVersion(): string {
    return "V00.07.00";
  }
  protected getCustomTools() {
    return {
      schedule_task: tool({
        description: "Schedule a task for a partner agent",
        inputSchema: z.object({
          delaySeconds: z.number(),
          instruction: z.string()
        }),
        execute: async ({ delaySeconds, instruction }) => {
          const taskId = `task-${Date.now()}`;
          const targetAgent = this.agentName === "Agent 1" ? "agent2" : "agent1";
          await this.kv.set(`/shared/${targetAgent}-tasks/${taskId}`, {
            instruction,
            createdAt: new Date().toISOString(),
            taskId
          });
          this.schedule(delaySeconds, "executeScheduledTask", taskId, { idempotent: true });
          return { taskId, scheduled: true };
        }
      }),
      set_model: tool({
        description: "Change the AI model being used",
        inputSchema: z.object({
          modelId: z.string()
        }),
        execute: async ({ modelId }) => {
          this.setModel(modelId);
          return { modelId, success: true };
        }
      }),
      increment_counter: tool({
        description: "Increment a shared counter (atomic)",
        inputSchema: z.object({ key: z.string() }),
        execute: async ({ key }) => {
          const value = await this.kv.increment(key);
          return { key, value };
        }
      }),
      get_counter: tool({
        description: "Get counter value",
        inputSchema: z.object({ key: z.string() }),
        execute: async ({ key }) => {
          const value = await this.kv.get(key) || 0;
          return { key, value };
        }
      })
    };
  }

  getCustomToolsJSON(): Record<string, any> {
    return {
      schedule_task: {
        description: "Schedule a task for a partner agent",
        inputSchema: {
          delaySeconds: { type: "number" },
          instruction: { type: "string" }
        }
      },
      set_model: {
        description: "Change the AI model being used",
        inputSchema: {
          modelId: { type: "string" }
        }
      },
      increment_counter: {
        description: "Increment a shared counter (atomic)",
        inputSchema: {
          key: { type: "string" }
        }
      },
      get_counter: {
        description: "Get counter value",
        inputSchema: {
          key: { type: "string" }
        }
      }
    };
  }

  async executeScheduledTask(taskId: string) {
    const targetAgent = this.agentName === "Agent 1" ? "agent2" : "agent1";
    const task = await this.kv.get(`/shared/${targetAgent}-tasks/${taskId}`);
    if (!task) return;
    console.log(`${this.agentName} executing: ${task.instruction}`);
  }

  async onChatMessage(onFinish: unknown, options?: any) {
    for await (const result of this.generateResponse(options)) {
      return result.toUIMessageStreamResponse();
    }
  }

  protected getKVStore(): KVStore {
    if (this.simMode) {
      return new KVStore(this.env.FILES);
    }
    return new KVStore(this.env.FILES);
  }
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.07.00 | 2026-06-04 | ai(cline) | Add FR-NF-05 v2 integration |
// | V00.06.00 | 2026-06-04 | ai(cline) | Add getKVStore for Durable Objects vs R2 |
// | V00.02.00 | 2026-06-04 | ai(cline) | Apply code change history conventions |
// | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |