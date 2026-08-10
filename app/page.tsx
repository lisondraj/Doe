import { redirect } from "next/navigation";

import { DOEHEALTH_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

/**
 * Production `/` on doe.care is rewritten to /doehealth; doehealth.care `/` rewrites to /premed.
 * Localhost and preview hosts fall through here — send them to the doe.care landing route.
 */
export default function HomePage() {
  redirect(DOEHEALTH_PATH);
}
