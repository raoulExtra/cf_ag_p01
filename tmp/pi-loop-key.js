import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

let MODEL = "kilo/poolside/laguna-xs.2:free";

const kilo = {
  api: {
    model: {
      set: async ({ model }) => {
        MODEL = model;
      },
    },
  },
};

await kilo.api.model.set({
  model: "kilo/poolside/laguna-xs.2:free",
});

const { createKilo } = await import(
  "file:///home/peter/.config/kilo/node_modules/@kilocode/sdk/dist/index.js"
);

function parseModel(model) {
  const slash = model.indexOf("/");
  if (slash === -1) return { providerID: "kilo", modelID: model };
  return { providerID: model.slice(0, slash), modelID: model.slice(slash + 1) };
}

readline.emitKeypressEvents(input);
if (input.isTTY) input.setRawMode(true);

let current = "";
let lines = [];
const { client, server } = await createKilo({ port: 0, timeout: 15000 });
const created = await client.session.create({ body: { title: "tmp/pi-loop-key" } });
const sessionID = created.data.id;

function redraw() {
  output.write("\r\x1b[2K");
  output.write(lines.length === 0 ? `> ${current}` : `... ${current}`);
}

async function submit(prompt) {
  const result = await client.session.prompt({
    path: { id: sessionID },
    body: {
      model: parseModel(MODEL),
      parts: [{ type: "text", text: prompt }],
    },
  });

  const text = (result.data?.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (text) {
    output.write(`\n[${MODEL}]\n`);
    output.write(text + "\n");
  }
}

function shutdown(code = 0) {
  if (input.isTTY) input.setRawMode(false);
  output.write("\n");
  server.close();
  process.exit(code);
}

redraw();

input.on("keypress", async (str, key) => {
  if (key.ctrl && key.name === "c") return shutdown(0);
  if (key.name === "escape") return shutdown(0);
  if (key.name === "return") {
    const prompt = current;
    current = "";
    output.write("\n");

    if (lines.length === 0 && !prompt.trim()) {
      redraw();
      return;
    }

    if (prompt.trim() === ":exit" || prompt.trim() === "exit" || prompt.trim() === "quit") {
      return shutdown(0);
    }

    if (prompt === "") {
      const fullPrompt = lines.join("\n").trim();
      lines = [];
      if (!fullPrompt) {
        redraw();
        return;
      }
      try {
        await submit(fullPrompt);
      } catch (error) {
        console.error(error);
      }
      redraw();
      return;
    }

    lines.push(prompt);
    redraw();
    return;
  }
  if (key.name === "backspace") {
    current = current.slice(0, -1);
    redraw();
    return;
  }
  if (str) {
    current += str;
    redraw();
  }
});
