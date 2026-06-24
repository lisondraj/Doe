import type { Metadata } from "next";
import { headers } from "next/headers";

import { BlogRouter } from "@/components/blog/BlogRouter";
import { JoinMobileView } from "@/components/join/JoinMobileView";
import { joinPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "Join the waitlist · Doe",
  description: "Join the Doe waitlist.",
  alternates: {
    canonical: joinPageUrl(),
  },
};

export default function JoinPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  return (
    <BlogRouter initialVariant={initialVariant}>
      <JoinMobileView />
    </BlogRouter>
  );
}
