import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { KVStore } from "../../shared/kv-store";

describe("KVStore Integration (Sim Mode)", () => {
  let kv: KVStore;
  let mockBucket: any;

  beforeEach(() => {
    mockBucket = {
      data: {} as Record<string, string>,
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    };
    kv = new KVStore(mockBucket as any);
  });

  it("should set and get a value", async () => {
    mockBucket.put.mockResolvedValue(undefined);
    mockBucket.get.mockResolvedValue({
      text: () => Promise.resolve(JSON.stringify({ key: "value" })),
    });

    await kv.set("test-key", { key: "value" });
    const result = await kv.get("test-key");

    expect(result).toEqual({ key: "value" });
  });

  it("should return null for missing key", async () => {
    mockBucket.get.mockResolvedValue(null);

    const result = await kv.get("missing-key");

    expect(result).toBeNull();
  });

  it("should increment counter", async () => {
    mockBucket.get.mockResolvedValue({
      text: () => Promise.resolve(JSON.stringify(5)),
    });
    mockBucket.put.mockResolvedValue(undefined);

    const result = await kv.increment("counter-key");

    expect(result).toBe(6);
  });

  it("should handle missing counter", async () => {
    mockBucket.get.mockResolvedValue(null);
    mockBucket.put.mockResolvedValue(undefined);

    const result = await kv.increment("new-counter");

    expect(result).toBe(1);
  });

  it("should delete a key", async () => {
    mockBucket.delete.mockResolvedValue(undefined);

    await kv.delete("delete-key");

    expect(mockBucket.delete).toHaveBeenCalledWith("delete-key");
  });

  it("should handle append to empty list", async () => {
    mockBucket.get.mockResolvedValue(null);
    mockBucket.put.mockResolvedValue(undefined);

    const result = await kv.append("new-list", { item: 1 });

    expect(result).toEqual([{ item: 1 }]);
  });

  it("should handle invalid JSON gracefully", async () => {
    mockBucket.get.mockResolvedValue({
      text: () => Promise.resolve("not valid json"),
    });

    const result = await kv.get("invalid-json-key");

    expect(result).toBeNull();
  });
});