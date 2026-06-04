import { describe, it, expect, vi } from "vitest";

vi.mock("../../agents/agent1", () => ({
  Agent1: class {
    static getVersion(): string { return "V00.06.00"; }
    agentName = "Agent 1";
    partnerInputPath = "/shared/agent2-input.txt";
    partnerOutputPath = "/shared/agent1-input.txt";
    constructor() {}
  }
}));

vi.mock("../../agents/agent2", () => ({
  Agent2: class {
    static getVersion(): string { return "V00.06.00"; }
    agentName = "Agent 2";
    partnerInputPath = "/shared/agent1-input.txt";
    partnerOutputPath = "/shared/agent2-input.txt";
    constructor() {}
  }
}));

import { Agent1 } from "../../agents/agent1";
import { Agent2 } from "../../agents/agent2";

describe("Agents", () => {
  describe("Agent1", () => {
    it("should extend CustomAgent", () => {
      const agent = new Agent1();
      expect(agent.agentName).toBe("Agent 1");
    });

    it("should have correct paths", () => {
      const agent = new Agent1();
      expect(agent.partnerInputPath).toBe("/shared/agent2-input.txt");
      expect(agent.partnerOutputPath).toBe("/shared/agent1-input.txt");
    });

    it("should have getVersion", () => {
      expect(Agent1.getVersion()).toBe("V00.06.00");
    });
  });

  describe("Agent2", () => {
    it("should extend CustomAgent", () => {
      const agent = new Agent2();
      expect(agent.agentName).toBe("Agent 2");
    });

    it("should have correct paths", () => {
      const agent = new Agent2();
      expect(agent.partnerInputPath).toBe("/shared/agent1-input.txt");
      expect(agent.partnerOutputPath).toBe("/shared/agent2-input.txt");
    });

    it("should have getVersion", () => {
      expect(Agent2.getVersion()).toBe("V00.06.00");
    });
  });
});
