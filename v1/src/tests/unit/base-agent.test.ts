import { describe, it, expect } from "vitest";
import { BaseAgent } from "../../agents/base-agent";

describe("BaseAgent", () => {
  it("should have getVersion method", () => {
    expect(BaseAgent.getVersion()).toBe("V00.06.00");
  });

  it("should be instantiable with required parameters", () => {
    const agent = new (class extends BaseAgent {
      constructor() {
        super("TestAgent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
    expect(agent.agentName).toBe("TestAgent");
  });

  it("should default to simMode true", () => {
    const agent = new (class extends BaseAgent {
      constructor() {
        super("TestAgent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
    expect(agent.simMode).toBe(true);
  });

  it("should default role to collaborator", () => {
    const agent = new (class extends BaseAgent {
      constructor() {
        super("TestAgent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
    expect(agent.role).toBe("collaborator");
  });
});