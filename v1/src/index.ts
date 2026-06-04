import { routeAgentRequest } from "agents";
import { Agent1 } from "./agents/agent1";
import { Agent2 } from "./agents/agent2";

export { Agent1, Agent2 };

export function getVersion(): string {
  return "V00.05.00";
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/agent1") {
      return (await routeAgentRequest(request, env, "agent1")) || new Response("Not found", { status: 404 });
    }
    
    if (url.pathname === "/agent2") {
      return (await routeAgentRequest(request, env, "agent2")) || new Response("Not found", { status: 404 });
    }
    
    return new Response("Multi-Agent Server\n\nUse /agent1 or /agent2 to chat with each agent.\n\nAgents work in parallel - each has its own Durable Object.", {
      headers: { "Content-Type": "text/plain" }
    });
  }
} satisfies ExportedHandler<Env>;

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.05.00 | 2026-06-04 | ai(cline) | Add syst system test requirement |
// | V00.02.00 | 2026-06-04 | ai(cline) | Apply code change history conventions |
// | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |