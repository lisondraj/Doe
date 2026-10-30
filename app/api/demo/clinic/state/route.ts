import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { respond } from "@/lib/demo/demo-http";
import { clinicState } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** Everything /demo/clinic shows: sessions, analytics, availability and settings. */
export function GET(request: Request) {
  return respond(async () => {
    rateLimit("read", clientIp(request));
    return clinicState();
  });
}
