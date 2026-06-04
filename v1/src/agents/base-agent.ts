import { AIChatAgent } from "@cloudflare/ai-chat";
import { createWorkersAI } from "workers-ai-provider";
import { streamText, tool } from "ai";
import { z } from "zod";
import { fileTools } from "../shared/file-tools";
import { KVStore } from "../shared/kv-store";

export class BaseAgent extends AIChatAgent<Env> {
  static getVersion(): string {
    return "V00.05.00";
  }
  maxPersistedMessages = 50;
  agentName: string;
  partnerInputPath: string;
  partnerOutputPath: string;
  kv: KVStore;
  modelId: string;
  simMode: boolean = true;
  role: string = "collaborator";

  constructor(agentName: string, partnerInputPath: string, partnerOutputPath: string, modelId: string = "@cf/meta/llama-3.2-1b-instruct") {
    super();
    this.agentName = agentName;
    this.partnerInputPath = partnerInputPath;
    this.partnerOutputPath = partnerOutputPath;
    this.modelId = modelId;
    this.kv = new KVStore(this.env.FILES);
  }

  setModel(modelId: string) {
    this.modelId = modelId;
  }

protected getSystemPrompt(): string {
    return `You are ${this.agentName} in role ${this.role}. Communicate via /shared/ file system.
When coordinating, write to ${this.partnerOutputPath} and read from ${this.partnerInputPath}.
Use KV store at /shared/kv/ for state. Be short and precise.`;
  }

  protected getSystemPromptJSON(): Record<string, any> {
    return {
      agentName: this.agentName,
      role: this.role,
      partnerInputPath: this.partnerInputPath,
      partnerOutputPath: this.partnerOutputPath,
      instructions: "Be short and precise. Communicate via /shared/ file system.",
      kvStorePath: "/shared/kv/"
    };
  }

  setSimMode(enabled: boolean) {
    this.simMode = enabled;
  }

  setRole(role: string) {
    this.role = role;
  }

  getDummyResponse(userMessage: string): string {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes("name")) return "Here " + this.agentName + " in role " + this.role + ".";
    if (lowerMsg.includes("role")) return "Here " + this.agentName + " in role " + this.role + ".";
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) return "Here " + this.agentName + " in role " + this.role + ".";
    return "Ready to collaborate.";
  }

  protected async* generateResponse(options?: any) {
    if (this.simMode) {
      yield {
        text: () => this.getDummyResponse(this.messages[this.messages.length - 1]?.content || ""),
        source: "dummy"
      };
      return;
    }

    const workersai = createWorkersAI({ binding: this.env.AI });

    const result = streamText({
      model: workersai(this.modelId),
      system: this.getSystemPrompt(),
      messages: this.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: typeof m.content === "string" ? m.content : m.content?.[0]?.text || ""
      })),
      tools: this.getTools(),
      abortSignal: options?.abortSignal
    });

    yield result;
  }

  protected getTools() {
    return {
      ...fileTools(this.env),
      ...this.getCustomTools()
    };
  }

  protected getCustomTools() {
    return {};
  }
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.05.00 | 2026-06-04 | ai(cline) | Add syst system test requirement |
// | V00.02.00 | 2026-06-04 | ai(cline) | Apply code change history conventions |
// | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |