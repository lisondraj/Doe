import { llmsTxt } from "@/lib/agent-files/doe-agent-files";
import { CORS, originOf } from "@/lib/demo/demo-http";

export const dynamic = "force-dynamic";

/** llms.txt: what Doe is and where an agent finds the API, OpenAPI and MCP. */
export function GET(request: Request) {
  return new Response(llmsTxt(originOf(request)), { headers: { ...CORS, "Content-Type": "text/plain; charset=utf-8" } });
}
