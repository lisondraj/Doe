import { redirect } from "next/navigation";

import { DOEHEALTH_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

/**
 * Production `/` on doe.care rewrites to /premed; doehealth.care `/` rewrites to /doehealth.
 * Localhost and preview hosts fall through here — send them to the doehealth landing route.
 */
export default function HomePage() {
  redirect(DOEHEALTH_PATH);
}
