import { apiDocs } from "@/lib/demo/demo-docs";
import { originOf, preflight, respond } from "@/lib/demo/demo-http";

export const dynamic = "force-dynamic";

/** How an agent uses the /demo API and MCP server. */
export function GET(request: Request) {
  return respond(async () => apiDocs(originOf(request)));
}

export const OPTIONS = preflight;
