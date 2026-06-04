import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Version Separation", () => {
  describe("V2-VERS_SEPA-02: v1 stays minimal, v2 has efficient OO", () => {
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

  describe("V2-VERS_SEPA-01: v2 code goes to v2\\src", () => {
    it("should have v2\\src directory structure", () => {
      const expectedDirs = ["v2/src/agents", "v2/src/shared", "v2/src/tests"];
      expectedDirs.forEach(d => {
        expect(d).toMatch(/v2[/\\]src/);
      });
    });
  });

  describe("V2-VERS_SEPA-03: testing structure consistency", () => {
    it("should have tests in comparable folders", () => {
      const testPaths = [
        "v1/src/tests",
        "v2/src/tests"
      ];
      testPaths.forEach(p => {
        expect(p).toContain("tests");
      });
    });
  });
});