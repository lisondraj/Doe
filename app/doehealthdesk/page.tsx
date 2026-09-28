import { headers } from "next/headers";

import { DoeHealthDeskPage } from "@/components/doehealth-desk/DoeHealthDeskPage";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function DoeHealthDeskRoute() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <DoeHealthDeskPage initialVariant={initialVariant} />;
}
