import type { Metadata } from "next";
import { headers } from "next/headers";

import { WaitlistRouter } from "@/components/waitlist/WaitlistRouter";
import { waitlistPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "Join the waitlist · Doe",
  description: "Join the Doe waitlist.",
  alternates: {
    canonical: waitlistPageUrl(),
  },
};

export default function WaitlistPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  return <WaitlistRouter initialVariant={initialVariant} />;
}
