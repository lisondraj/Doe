import { robotsTxt } from "@/lib/agent-files/doe-agent-files";
import { originOf } from "@/lib/demo/demo-http";

export const dynamic = "force-dynamic";

/** Crawlers and agents are welcome everywhere but admin, with pointers to llms.txt, OpenAPI and the MCP card. */
export function GET(request: Request) {
  return new Response(robotsTxt(originOf(request)), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
