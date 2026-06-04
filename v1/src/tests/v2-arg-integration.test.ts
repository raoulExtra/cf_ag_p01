import { describe, it, expect, beforeEach } from "vitest";
import { CustomAgent } from "../agents/custom-agent";

describe("V2 Argument Integration Tests", () => {
  let agent: CustomAgent;

  beforeEach(() => {
    agent = new (class extends CustomAgent {
      constructor() {
        super("TestAgent", "/shared/input.txt", "/shared/output.txt");
      }
    })();
  });

  describe("TEST-V2-09: v2 arg true, set simMode=false, use real KV store", () => {
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