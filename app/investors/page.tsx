import type { Metadata } from "next";
import { headers } from "next/headers";

import { AboutRouter } from "@/components/about/AboutRouter";
import { investorsPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "For Investors · Doe",
  description: "About Doe for investors.",
  alternates: {
    canonical: investorsPageUrl(),
  },
};

export default function InvestorsPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  return <AboutRouter initialVariant={initialVariant} />;
}
