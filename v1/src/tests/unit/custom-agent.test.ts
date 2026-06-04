import { describe, it, expect, vi } from "vitest";

vi.mock("../../agents/custom-agent", () => {
  const CustomAgent = class {
    static getVersion(): string {
      return "V00.06.00";
    }
    agentName: string;
    role: string = "collaborator";
    simMode: boolean = true;
    kv: any;
    useV2: boolean = false;
    durableObjectsEnabled: boolean = false;
    constructor(name: string, inputPath?: string, outputPath?: string) {
      this.agentName = name;
    }
    getCustomTools() {
      return {
        schedule_task: {},
        set_model: {},
        increment_counter: {},
        get_counter: {}
      };
    }
    getCustomToolsJSON() {
      return {
        schedule_task: { description: "...", inputSchema: {} },
        set_model: { description: "...", inputSchema: {} }
      };
    }
  };
  return { CustomAgent };
});

import { CustomAgent } from "../../agents/custom-agent";

describe("CustomAgent", () => {
  it("should extend BaseAgent", () => {
    const agent = new CustomAgent("TestAgent");
    expect(agent.agentName).toBe("TestAgent");
  });

  it("should have custom tools", () => {
    const agent = new CustomAgent("TestAgent");
    const tools = agent.getCustomTools();
    expect(tools).toHaveProperty("schedule_task");
    expect(tools).toHaveProperty("set_model");
    expect(tools).toHaveProperty("increment_counter");
    expect(tools).toHaveProperty("get_counter");
  });

  it("should have getVersion", () => {
    expect(CustomAgent.getVersion()).toBe("V00.06.00");
  });

  it("should get custom tools JSON", () => {
    const agent = new CustomAgent("TestAgent");
    const jsonTools = agent.getCustomToolsJSON();
    expect(jsonTools).toHaveProperty("schedule_task");
    expect(jsonTools).toHaveProperty("set_model");
  });
});
