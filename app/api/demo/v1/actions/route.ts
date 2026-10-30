import type { AgentAction } from "@/lib/demo/demo-engine";
import { bearer, channelOf, jsonBody, preflight, respond } from "@/lib/demo/demo-http";
import { agentAct } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** One agent action: { type, ...fields }. Returns the result and the updated session. */
export function POST(request: Request) {
  return respond(async () => agentAct(bearer(request), (await jsonBody(request)) as unknown as AgentAction, channelOf(request)));
}

export const OPTIONS = preflight;
