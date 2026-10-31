import type { AgentAction } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { bearer, channelOf, jsonBody, originOf, preflight, respond } from "@/lib/demo/demo-http";
import { agentAct, shareForms } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** One agent action: { type, ...fields }. Returns the result and the updated session. */
export function POST(request: Request) {
  return respond(async () => {
    rateLimit("act", clientIp(request));
    const b = await jsonBody(request);
    /** A private link to a read-only copy of the forms, for the agent to give its user. */
    if (b.type === "share_forms") return shareForms(bearer(request), originOf(request), b.expires_days, channelOf(request));
    return agentAct(bearer(request), b as unknown as AgentAction, channelOf(request));
  });
}

export const OPTIONS = preflight;
