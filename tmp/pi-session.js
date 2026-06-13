(async () => {
  const { createAgentSession, SessionManager } = await import(
    "file:///home/peter/.hermes/node/lib/node_modules/@earendil-works/pi-coding-agent/dist/index.js"
  );

  const { session } = await createAgentSession({
    sessionManager: SessionManager.continueRecent(process.cwd()),
  });

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
