import { headers } from "next/headers";

import { DoeCareFall26DeskPage } from "@/components/doe-carefall26-desk/DoeCareFall26DeskPage";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function DoeCareFall26DeskRoute() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <DoeCareFall26DeskPage initialVariant={initialVariant} />;
}
