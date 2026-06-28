import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AboutMobileView } from "@/components/about/AboutMobileView";
import { aboutPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "About · Doe",
  description: "Doe is on a mission to redefine healthcare.",
  alternates: {
    canonical: aboutPageUrl(),
  },
};

export default function AboutPage() {
  const ua = headers().get("user-agent") ?? "";
  if (!MOBILE_UA.test(ua)) {
    redirect("/");
  }

  return <AboutMobileView />;
}
