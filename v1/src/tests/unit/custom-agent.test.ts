import { describe, it, expect, beforeEach } from "vitest";
import { CustomAgent } from "../../agents/custom-agent";

describe("CustomAgent", () => {
  let agent: CustomAgent;

  beforeEach(() => {
    agent = new (class extends CustomAgent {
      constructor() {
        super("TestAgent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
  });

  it("should extend BaseAgent", () => {
    expect(agent.agentName).toBe("TestAgent");
  });

  it("should have custom tools", () => {
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
    const jsonTools = agent.getCustomToolsJSON();
    expect(jsonTools).toHaveProperty("schedule_task");
    expect(jsonTools).toHaveProperty("set_model");
  });
});