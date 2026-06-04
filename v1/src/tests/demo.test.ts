import { describe, it, expect } from "vitest";
import { DEMO_INTERACTIONS, getVersion } from "../demo/interaction-demo";

describe("Demo Module", () => {
  it("should export DEMO_INTERACTIONS", () => {
    expect(DEMO_INTERACTIONS).toContain("Agent 1");
    expect(DEMO_INTERACTIONS).toContain("Agent 2");
  });

  it("should have getVersion function", () => {
    expect(getVersion()).toBe("V00.06.00");
  });
});
