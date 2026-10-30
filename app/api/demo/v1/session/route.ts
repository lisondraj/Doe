import { bearer, preflight, respond } from "@/lib/demo/demo-http";
import { agentState } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The agent's session: status, pricing, hold, booking, forms, threads, availability and next steps. */
export function GET(request: Request) {
  return respond(() => agentState(bearer(request)));
}

export const OPTIONS = preflight;
