import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--host" || arg === "--port") {
      out[arg.slice(2)] = argv[++i];
      continue;
    }
    if (arg.startsWith("--host=")) out.host = arg.slice(7);
    if (arg.startsWith("--port=")) out.port = arg.slice(7);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const host = args.host ?? "127.0.0.1";
const port = args.port ?? "3000";
const BASE_URL = process.env.OPENAI_KILO_PROXY_URL ?? `http://${host}:${port}/v1`;

async function chat(text) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

const rl = readline.createInterface({ input, output });

try {
  while (true) {
    const prompt = (await rl.question("> ")).trim();
    if (prompt === "exit") break;
    if (!prompt) continue;

    const reply = await chat(prompt);
    if (reply) process.stdout.write(`${reply}\n`);
  }
} finally {
  rl.close();
}
