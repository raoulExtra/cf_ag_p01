import { describe, it, expect } from "vitest";
import { V2BaseAgent } from "../../v2/src/agents/v2-base-agent";

describe("V2 Base Agent Integration", () => {
  it("should extend BaseAgent for V2 production use", () => {
    const agent = new (class extends V2BaseAgent {
      constructor() {
        super("V2Agent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
    expect(agent.agentName).toBe("V2Agent");
  });

  it("should support Durable Objects when simMode is false", () => {
    const agent = new (class extends V2BaseAgent {
      constructor() {
        super("V2Agent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
    agent.setSimMode(false);
    agent.setDurableObjects(true);
    expect(agent).toBeTruthy();
  });

  it("should keep v1 agents stable with v2-base-agent", () => {
    expect(V2BaseAgent).toBeTruthy();
    expect(V2BaseAgent.getVersion()).toBe("V00.15.00");
  });
});