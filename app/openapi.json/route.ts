import { openApi } from "@/lib/agent-files/doe-agent-files";
import { CORS, originOf, preflight } from "@/lib/demo/demo-http";

export const dynamic = "force-dynamic";

/** The /api/demo/v1 REST API as OpenAPI 3.1. */
export function GET(request: Request) {
  return Response.json(openApi(originOf(request)), { headers: CORS });
}

export const OPTIONS = preflight;
