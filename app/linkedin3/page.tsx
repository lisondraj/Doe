import type { Metadata } from "next";

import { LinkedIn3View } from "@/components/linkedin/LinkedIn3View";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN3_PATH = "/linkedin3";

export const metadata: Metadata = {
  title: "LinkedIn 3 · Doe",
  description: "Doe LinkedIn banner — Doe Intelligence Inc.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN3_PATH}`,
  },
};

export default function LinkedIn3Page() {
  return <LinkedIn3View />;
}
