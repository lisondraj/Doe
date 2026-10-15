import { headers } from "next/headers";

import type { DoeHealthDesk2Variant } from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

/** Server-side first paint for desk pages — phone on mobile user agents, desktop otherwise. */
export function doehealthDesk2InitialVariant(): DoeHealthDesk2Variant {
  const ua = headers().get("user-agent") ?? "";
  return MOBILE_UA.test(ua) ? "phone" : "desktop";
}
