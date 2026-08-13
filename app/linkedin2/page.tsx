import type { Metadata } from "next";

import { LinkedIn2ShaderView } from "@/components/linkedin/LinkedIn2ShaderView";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN2_PATH = "/linkedin2";

export const metadata: Metadata = {
  title: "LinkedIn 2 · Doe",
  description: "Doe LinkedIn shader background with model picker.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN2_PATH}`,
  },
};

export default function LinkedIn2Page() {
  return <LinkedIn2ShaderView />;
}
