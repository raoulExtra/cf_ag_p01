import http from "node:http";
import { createHash } from "node:crypto";
import { createKilo } from "file:///home/peter/.config/kilo/node_modules/@kilocode/sdk/dist/index.js";

const KILO_MODEL = "kilo/poolside/laguna-xs.2:free";
const API_MODEL = `l${KILO_MODEL}`;
const LOG_IO = process.env.OPENAI_KILO_PROXY_LOG_IO !== "0";

function parseModel(model) {
  const value = String(model ?? API_MODEL);
  const normalized = value.startsWith("l") ? value.slice(1) : value;
  const slash = normalized.indexOf("/");
  if (slash === -1) return { providerID: "kilo", modelID: normalized };
  return { providerID: normalized.slice(0, slash), modelID: normalized.slice(slash + 1) };
}

function toPrompt(messages = []) {
  return messages
    .map((m) => {
      const content = Array.isArray(m.content)
        ? m.content.map((p) => (typeof p === "string" ? p : p?.text ?? p?.content ?? "")).join("")
        : String(m.content ?? "");
      return `${m.role?.toUpperCase?.() ?? "USER"}: ${content}`;
    })
    .join("\n")
    .trim();
}

function toInputText(input) {
  if (Array.isArray(input)) return input.map((x) => String(x)).join("\n");
  return String(input ?? "");
}

function embeddingFor(text, dims = 16) {
  const hash = createHash("sha256").update(text).digest();
  const vector = [];
  for (let i = 0; i < dims; i++) {
    const a = hash[i % hash.length];
    const b = hash[(i + 8) % hash.length];
    vector.push(((a << 8) | b) / 65535 * 2 - 1);
  }
  return vector;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function writeJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function writeSse(res, event, data) {
  if (event) res.write(`event: ${event}\n`);
  if (data === "[DONE]") {
    res.write(`data: [DONE]\n\n`);
    return;
  }
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function previewText(value) {
  return String(value ?? "");
}

function logExchange(label, input, output, extra = undefined) {
  if (!LOG_IO) return;
  console.log(`\n[${new Date().toISOString()}] ${label}`);
  if (extra) console.log(extra);
  console.log(`INPUT:\n${previewText(input)}`);
  console.log(`OUTPUT:\n${previewText(output)}`);
}

async function getCompletion(client, prompt, model, title = "openai-proxy") {
  const created = await client.session.create({ body: { title } });
  const sessionID = created.data.id;
  const result = await client.session.prompt({
    path: { id: sessionID },
    body: {
      model,
      parts: [{ type: "text", text: prompt }],
    },
  });

  const text = (result.data?.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const info = result.data?.info;
  return { text, info, sessionID };
}

const { client, server: kiloServer } = await createKilo({ port: 0, timeout: 15000 });

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    if (req.method === "GET" && url.pathname === "/v1/models") {
      return writeJson(res, 200, {
        object: "list",
        data: [{ id: API_MODEL, object: "model", created: Math.floor(Date.now() / 1000), owned_by: "kilo" }],
      });
    }

    if (req.method === "POST" && url.pathname === "/v1/embeddings") {
      const body = await readJson(req);
      const input = Array.isArray(body.input) ? body.input : [body.input];
      const data = input.map((item, index) => ({
        object: "embedding",
        index,
        embedding: embeddingFor(toInputText(item)),
      }));
      return writeJson(res, 200, {
        object: "list",
        model: body.model ?? API_MODEL,
        data,
        usage: { prompt_tokens: 0, total_tokens: 0 },
      });
    }

    if (req.method === "POST" && url.pathname === "/v1/chat/completions") {
      const body = await readJson(req);
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const prompt = toPrompt(messages);
      const model = parseModel(body.model ?? API_MODEL);
      const stream = Boolean(body.stream);

      if (stream) {
        res.writeHead(200, {
          "content-type": "text/event-stream; charset=utf-8",
          connection: "keep-alive",
          "cache-control": "no-cache, no-transform",
        });

        const { text, info, sessionID } = await getCompletion(client, prompt, model, body?.user ?? "openai-proxy");
        logExchange("POST /v1/chat/completions [stream]", prompt, text, `model=${body.model ?? API_MODEL}`);
        const created = Math.floor((info?.time?.created ?? Date.now()) / 1000);
        const id = info?.id ?? `chatcmpl_${sessionID}`;

        writeSse(res, "", {
          id,
          object: "chat.completion.chunk",
          created,
          model: body.model ?? API_MODEL,
          choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
        });

        writeSse(res, "", {
          id,
          object: "chat.completion.chunk",
          created,
          model: body.model ?? API_MODEL,
          choices: [{ index: 0, delta: {}, finish_reason: info?.finish ?? "stop" }],
        });
        writeSse(res, "", "[DONE]");
        return res.end();
      }

      const { text, info, sessionID } = await getCompletion(client, prompt, model, body?.user ?? "openai-proxy");
      logExchange("POST /v1/chat/completions", prompt, text, `model=${body.model ?? API_MODEL}`);
      return writeJson(res, 200, {
        id: info?.id ?? `chatcmpl_${sessionID}`,
        object: "chat.completion",
        created: Math.floor((info?.time?.created ?? Date.now()) / 1000),
        model: body.model ?? API_MODEL,
        choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: info?.finish ?? "stop" }],
        usage: info
          ? {
              prompt_tokens: info.tokens?.input ?? 0,
              completion_tokens: info.tokens?.output ?? 0,
              total_tokens: (info.tokens?.input ?? 0) + (info.tokens?.output ?? 0),
            }
          : undefined,
      });
    }

    if (req.method === "POST" && url.pathname === "/v1/responses") {
      const body = await readJson(req);
      const prompt = body.input ? toInputText(body.input) : toPrompt(body.messages ?? []);
      const model = parseModel(body.model ?? API_MODEL);
      const { text, info, sessionID } = await getCompletion(client, prompt, model, body?.user ?? "openai-proxy");
      logExchange("POST /v1/responses", prompt, text, `model=${body.model ?? API_MODEL}`);
      return writeJson(res, 200, {
        id: info?.id ?? `resp_${sessionID}`,
        object: "response",
        created_at: Math.floor((info?.time?.created ?? Date.now()) / 1000),
        model: body.model ?? API_MODEL,
        output: [{ type: "message", role: "assistant", content: [{ type: "output_text", text }] }],
      });
    }

    return writeJson(res, 404, { error: { message: "Not found" } });
  } catch (error) {
    if (res.headersSent) {
      res.end();
      return;
    }
    return writeJson(res, 500, { error: { message: String(error?.message ?? error) } });
  }
});

const host = "127.0.0.1";
const port = await new Promise((resolve) => server.listen(0, host, () => resolve(server.address().port)));
console.log(`OpenAI-compatible API listening on http://${host}:${port}/v1`);
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);
console.log(`Model: ${API_MODEL}`);
console.log(`Log I/O: ${LOG_IO ? "enabled" : "disabled"}`);

const shutdown = () => {
  server.close();
  kiloServer.close();
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
