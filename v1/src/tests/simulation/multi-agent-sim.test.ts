import { describe, it, expect, beforeEach } from "vitest";
import { BaseAgent } from "../../agents/base-agent";

describe("Multi-Agent Simulation", () => {
  let agent1: BaseAgent;
  let agent2: BaseAgent;

  class TestAgent extends BaseAgent {
    constructor(name: string, inputPath: string, outputPath: string) {
      super(name, inputPath, outputPath);
    }
  }

  beforeEach(() => {
    agent1 = new TestAgent("Agent1", "/shared/agent2-input.txt", "/shared/agent1-input.txt");
    agent2 = new TestAgent("Agent2", "/shared/agent1-input.txt", "/shared/agent2-input.txt");
  });

  it("should have different names", () => {
    expect(agent1.agentName).toBe("Agent1");
    expect(agent2.agentName).toBe("Agent2");
  });

  it("should have inverted paths", () => {
    expect(agent1.partnerInputPath).toBe("/shared/agent2-input.txt");
    expect(agent1.partnerOutputPath).toBe("/shared/agent1-input.txt");
    expect(agent2.partnerInputPath).toBe("/shared/agent1-input.txt");
    expect(agent2.partnerOutputPath).toBe("/shared/agent2-input.txt");
  });

  it("should return dummy response in sim mode", () => {
    agent1.setSimMode(true);
    const response = agent1.getDummyResponse("Hello");
    expect(response).toBe("Here Agent1 in role collaborator.");
  });

  it("should handle name query", () => {
    agent1.setSimMode(true);
    const response = agent1.getDummyResponse("What is your name?");
    expect(response).toBe("Here Agent1 in role collaborator.");
  });

  it("should handle role query", () => {
    agent1.setSimMode(true);
    const response = agent1.getDummyResponse("What is your role?");
    expect(response).toBe("Here Agent1 in role collaborator.");
  });

  it("should allow role modification", () => {
    agent1.setRole("leader");
    agent1.setSimMode(true);
    const response = agent1.getDummyResponse("Hello");
    expect(response).toBe("Here Agent1 in role leader.");
  });
});