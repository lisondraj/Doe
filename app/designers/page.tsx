import { headers } from "next/headers";

import { DesignersRouter } from "@/components/designers/DesignersRouter";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function DesignersPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <DesignersRouter initialVariant={initialVariant} />;
}
