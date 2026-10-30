import { preflight, respond } from "@/lib/demo/demo-http";
import { catalog } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The clinic's catalog and live availability; no session needed. */
export function GET() {
  return respond(catalog);
}

export const OPTIONS = preflight;
