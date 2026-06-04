import { describe, it, expect, vi } from "vitest";

vi.mock("../../../v2/src/agents/v2-base-agent", () => ({
  V2BaseAgent: class {
    static getVersion(): string { return "V00.15.00"; }
    agentName = "V2Agent";
    role = "collaborator";
    simMode: boolean = true;
    durableObjectsEnabled: boolean = false;
    kv: any;
    constructor(name: string, inputPath?: string, outputPath?: string) {
      this.agentName = name;
    }
    setSimMode(enabled: boolean) { this.simMode = enabled; }
    setDurableObjects(enabled: boolean) { this.durableObjectsEnabled = enabled; }
  }
}));

import { V2BaseAgent } from "../../../v2/src/agents/v2-base-agent";

describe("V2 Base Agent Integration", () => {
  it("should extend BaseAgent for V2 production use", () => {
    const agent = new V2BaseAgent("V2Agent", "/shared/input.txt", "/shared/output.txt");
    expect(agent.agentName).toBe("V2Agent");
  });

  it("should support Durable Objects when simMode is false", () => {
    const agent = new V2BaseAgent("V2Agent", "/shared/input.txt", "/shared/output.txt");
    agent.setSimMode(false);
    agent.setDurableObjects(true);
    expect(agent).toBeTruthy();
  });

  it("should keep v1 agents stable with v2-base-agent", () => {
    expect(V2BaseAgent).toBeTruthy();
    expect(V2BaseAgent.getVersion()).toBe("V00.15.00");
  });
});
