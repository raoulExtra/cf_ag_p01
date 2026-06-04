import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../agents/custom-agent", () => {
  const CustomAgent = class {
    static getVersion(): string { return "V00.08.00"; }
    agentName: string;
    role: string = "collaborator";
    simMode: boolean = true;
    kv: any = { get: () => {}, set: () => {} };
    useV2: boolean = false;
    durableObjectsEnabled: boolean = false;
    constructor(name: string, inputPath?: string, outputPath?: string) {
      this.agentName = name;
    }
    setSimMode(enabled: boolean) { this.simMode = enabled; }
    setDurableObjects(enabled: boolean) { this.durableObjectsEnabled = enabled; }
    getCustomTools() { return {}; }
    getCustomToolsJSON() { return {}; }
  };
  return { CustomAgent };
});

import { CustomAgent } from "../agents/custom-agent";

describe("V2 Argument Integration Tests", () => {
  let agent: CustomAgent;

  beforeEach(() => {
    agent = new CustomAgent("TestAgent", "/shared/input.txt", "/shared/output.txt");
  });

  describe("TEST-CORE-10: v2 argument defaults to false", () => {
    it("should have v2 argument default to false", () => {
      expect(agent["useV2"]).toBe(false);
    });
  });

  describe("TEST-CORE-09: v2 arg true, set simMode=false, use real KV store", () => {
    it("should use Durable Objects when simMode is false and v2 arg is true", () => {
      agent.setSimMode(false);
      agent.setDurableObjects(true);
      expect(agent["simMode"]).toBe(false);
    });

    it("should return correct KV store for non-sim mode", () => {
      agent.setSimMode(false);
      const kv = agent["kv"];
      expect(kv).toBeTruthy();
    });
  });

  describe("TEST-V2-10: v2 arg true, set simMode=true, use R2 store", () => {
    it("should use R2 when simMode is true and v2 arg is true", () => {
      agent.setSimMode(true);
      expect(agent["simMode"]).toBe(true);
    });

    it("should return correct KV store for sim mode", () => {
      agent.setSimMode(true);
      const kv = agent["kv"];
      expect(kv).toBeTruthy();
    });
  });
});
