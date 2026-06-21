import { headers } from "next/headers";

import { HomeRouter } from "@/components/home/HomeRouter";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function OldPhonePage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <HomeRouter initialVariant={initialVariant} />;
}
