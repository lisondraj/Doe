import { headers } from "next/headers";

import type { DoeHealthDeskVariant } from "@/lib/doehealth/use-doehealth-desk-variant";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

/** Server-side first paint for desk pages — phone on mobile user agents, desktop otherwise. */
export function doehealthDeskInitialVariant(): DoeHealthDeskVariant {
  const ua = headers().get("user-agent") ?? "";
  return MOBILE_UA.test(ua) ? "phone" : "desktop";
}
