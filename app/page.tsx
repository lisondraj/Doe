import { redirect } from "next/navigation";

import { DOEHEALTH_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

/**
 * Production `/` on doe.care and doehealth.care is rewritten to /doehealth in middleware.
 * Localhost and preview hosts fall through here — send them to the landing route.
 */
export default function HomePage() {
  redirect(DOEHEALTH_PATH);
}
