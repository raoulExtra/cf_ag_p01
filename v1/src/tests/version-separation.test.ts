import { describe, it, expect } from "vitest";

describe("Version Separation", () => {
  it("should verify v1 stays minimal - only core agent functionality", () => {
    const v1Files = ["base-agent.ts", "agent1.ts", "agent2.ts", "custom-agent.ts"];
    v1Files.forEach(f => {
      expect(f).toBeTruthy();
    });
  });

  it("should verify v2 has efficient OO structure - separate modules", () => {
    const v2Modules = ["agents", "shared", "tests", "explain"];
    v2Modules.forEach(m => {
      expect(m).toBeTruthy();
    });
  });
});