import type { Metadata } from "next";

import { AboutRouter } from "@/components/about/AboutRouter";
import { aboutPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About · Doe",
  description: "Doe is on a mission to redefine healthcare.",
  alternates: {
    canonical: aboutPageUrl(),
  },
};

export default function AboutPage() {
  return <AboutRouter />;
}
