import { headers } from "next/headers";

import { DoeFall26DeskPage } from "@/components/doe-fall26-desk/DoeFall26DeskPage";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function DoeFall26DeskRoute() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <DoeFall26DeskPage initialVariant={initialVariant} />;
}
