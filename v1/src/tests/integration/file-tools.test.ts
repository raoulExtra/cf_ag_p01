import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileTool, writeFileTool, listFilesTool, getVersion, fileTools } from "../../shared/file-tools";

describe("File Tools", () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = {
      FILES: {
        get: vi.fn(),
        put: vi.fn(),
        list: vi.fn(),
      },
    };
  });

  it("should have getVersion function", () => {
    expect(getVersion()).toBe("V00.06.00");
  });

  describe("readFileTool", () => {
    it("should return error for missing file", async () => {
      mockEnv.FILES.get.mockResolvedValue(null);

      const result = await readFileTool(mockEnv).execute({ path: "/missing/file.txt" });

      expect(result).toEqual({ error: "File not found: /missing/file.txt" });
    });

    it("should read existing file", async () => {
      mockEnv.FILES.get.mockResolvedValue({
        text: () => Promise.resolve("file content"),
      });

      const result = await readFileTool(mockEnv).execute({ path: "/existing/file.txt" });

      expect(result).toEqual({ path: "/existing/file.txt", content: "file content" });
    });
  });

  describe("writeFileTool", () => {
    it("should write file and return size", async () => {
      mockEnv.FILES.put.mockResolvedValue(undefined);

      const result = await writeFileTool(mockEnv).execute({
        path: "/new/file.txt",
        content: "hello world",
      });

      expect(result).toEqual({ path: "/new/file.txt", size: 11, status: "written" });
    });
  });

  describe("listFilesTool", () => {
    it("should list files in directory", async () => {
      mockEnv.FILES.list.mockImplementation(async function* () {
        yield { key: "dir/file1.txt" };
        yield { key: "dir/file2.txt" };
      });

      const result = await listFilesTool(mockEnv).execute({ path: "dir/" });

      expect(result).toEqual({ path: "dir/", files: ["dir/file1.txt", "dir/file2.txt"] });
    });
  });

  describe("fileTools", () => {
    it("should return all file tools", () => {
      const tools = fileTools(mockEnv);
      expect(tools).toHaveProperty("read_file");
      expect(tools).toHaveProperty("write_file");
      expect(tools).toHaveProperty("list_files");
    });
  });
});
