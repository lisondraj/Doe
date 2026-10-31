import type { ClinicAction } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { jsonBody, respond } from "@/lib/demo/demo-http";
import { clinicAct, revokeShare, setConfig } from "@/lib/demo/demo-service";
import type { DemoConfig } from "@/lib/demo/demo-types";

export const dynamic = "force-dynamic";

/** Clinic staff actions from /demo/clinic: { session_id, type, ... }, or { type: "set_config", config }. */
export function POST(request: Request) {
  return respond(async () => {
    rateLimit("clinic", clientIp(request));
    const b = await jsonBody(request);
    if (b.type === "revoke_share") return revokeShare(b.session_id, b.share_id);
    if (b.type === "set_config") return { config: await setConfig((b.config ?? {}) as Partial<DemoConfig>) };
    return clinicAct(b.session_id, b as unknown as ClinicAction);
  });
}
