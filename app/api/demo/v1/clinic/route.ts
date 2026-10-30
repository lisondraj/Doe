import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { preflight, respond } from "@/lib/demo/demo-http";
import { catalog } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The clinic's catalog and live availability; no session needed. */
export function GET(request: Request) {
  return respond(async () => {
    rateLimit("read", clientIp(request));
    return catalog();
  });
}

export const OPTIONS = preflight;
