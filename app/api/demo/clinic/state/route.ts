import { respond } from "@/lib/demo/demo-http";
import { clinicState } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** Everything /demo/clinic shows: sessions, analytics, availability and settings. */
export function GET() {
  return respond(clinicState);
}
