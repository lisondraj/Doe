import { headers } from "next/headers";

import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { isDesignersRequest } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function HomePage() {
  const headerList = headers();
  const ua = headerList.get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return (
    <DoePhoneRouter
      initialVariant={initialVariant}
      staticNav={isDesignersRequest(headerList)}
    />
  );
}
