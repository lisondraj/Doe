import { checkHuman, clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { channelOf, jsonBody, originOf, preflight, respond } from "@/lib/demo/demo-http";
import { connect } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** Starts an agent session; both consents (terms, phi) must be true. */
export function POST(request: Request) {
  return respond(async () => {
    const ip = clientIp(request);
    rateLimit("connect", ip);
    const b = await jsonBody(request);
    const channel = channelOf(request);
    if (channel === "browser") checkHuman(b);
    return connect({
      channel,
      agentName: b.agent_name,
      userName: b.user_name,
      userLocation: b.user_location,
      userPhone: b.user_phone,
      request: b.request,
      consent: (b.consent ?? {}) as Record<string, unknown>,
    }, ip, null, originOf(request));
  });
}

export const OPTIONS = preflight;
