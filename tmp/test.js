(async () => {
  const { createAgentSession } = await import("file:///home/peter/.hermes/node/lib/node_modules/@earendil-works/pi-coding-agent/dist/index.js");

  const { session } = await createAgentSession();

  try {
    session.subscribe((event) => {
      if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
        process.stdout.write(event.assistantMessageEvent.delta);
      }
    });

    await session.prompt("Explain embeddings");
    process.stdout.write("\n");
  } finally {
    session.dispose();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
