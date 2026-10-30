import { channelOf, jsonBody, preflight, respond } from "@/lib/demo/demo-http";
import { connect } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** Starts an agent session; both consents (terms, phi) must be true. */
export function POST(request: Request) {
  return respond(async () => {
    const b = await jsonBody(request);
    return connect({
      channel: channelOf(request),
      agentName: b.agent_name,
      userName: b.user_name,
      request: b.request,
      consent: (b.consent ?? {}) as Record<string, unknown>,
    });
  });
}

export const OPTIONS = preflight;
