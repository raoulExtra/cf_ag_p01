import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

let MODEL = "kilo/kilo-auto/free";

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

(async () => {
  const rl = readline.createInterface({ input, output });
  const { client, server } = await createKilo({ port: 0, timeout: 15000 });
  const created = await client.session.create({ body: { title: "tmp/pi-loop" } });
  const sessionID = created.data.id;

  try {
    while (true) {
      const lines = [];
      while (true) {
        let line;
        try {
          line = await rl.question(lines.length === 0 ? "> " : ". ");
        } catch (error) {
          if (error && typeof error === "object" && "code" in error && error.code === "ERR_USE_AFTER_CLOSE") break;
          throw error;
        }

        if (line.trim() === ":exit") {
          rl.close();
          return;
        }

        if (line === "") break;
        lines.push(line);
      }

      const prompt = lines.join("\n").trim();
      if (!prompt) continue;

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
        process.stdout.write(`[${MODEL}]\n`);
        process.stdout.write(text + "\n");
      }
    }
  } finally {
    rl.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
