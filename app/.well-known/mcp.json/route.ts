import { mcpServerCard } from "@/lib/agent-files/doe-agent-files";
import { CORS, originOf, preflight } from "@/lib/demo/demo-http";

export const dynamic = "force-dynamic";

/** MCP server card: where Doe's MCP server is, how it's reached and the tools it offers. */
export function GET(request: Request) {
  return Response.json(mcpServerCard(originOf(request)), { headers: CORS });
}

export const OPTIONS = preflight;
