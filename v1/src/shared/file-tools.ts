import { tool } from "ai";
import { z } from "zod";

export function getVersion(): string {
  return "V00.06.00";
}

export function readFileTool(env: Env) {
  return tool({
    description: "Read a file from R2 storage",
    inputSchema: z.object({ path: z.string() }),
    execute: async ({ path }) => {
      const value = await env.FILES.get(path);
      if (!value) return { error: `File not found: ${path}` };
      return { path, content: await value.text() };
    }
  });
}

export function writeFileTool(env: Env) {
  return tool({
    description: "Write content to a file",
    inputSchema: z.object({ path: z.string(), content: z.string() }),
    execute: async ({ path, content }) => {
      await env.FILES.put(path, content);
      return { path, size: content.length, status: "written" };
    }
  });
}

export function listFilesTool(env: Env) {
  return tool({
    description: "List files in a directory",
    inputSchema: z.object({ path: z.string() }),
    execute: async ({ path }) => {
      const files = [];
      for await (const obj of env.FILES.list({ prefix: path })) {
        files.push(obj.key);
      }
      return { path, files };
    }
  });
}

export function fileTools(env: Env) {
  return {
    read_file: readFileTool(env),
    write_file: writeFileTool(env),
    list_files: listFilesTool(env)
  };
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.05.00 | 2026-06-04 | ai(cline) | Add syst system test requirement |
// | V00.02.00 | 2026-06-04 | ai(cline) | Apply code change history conventions |
// | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |