import type { Metadata } from "next";

import { LinkedIn2View } from "@/components/linkedin/LinkedIn2View";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN2_PATH = "/linkedin2";

export const metadata: Metadata = {
  title: "LinkedIn 2 · Doe",
  description: "Doe LinkedIn banner — off-white with Meet Doe headline.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN2_PATH}`,
  },
};

export default function LinkedIn2Page() {
  return <LinkedIn2View />;
}
