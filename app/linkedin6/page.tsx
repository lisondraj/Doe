import type { Metadata } from "next";

import { LinkedIn6View } from "@/components/linkedin/LinkedIn6View";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN6_PATH = "/linkedin6";

export const metadata: Metadata = {
  title: "LinkedIn 6 · Doe",
  description: "Doe LinkedIn banner — dark brown canvas with a centered liquid-glass lens.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN6_PATH}`,
  },
};

export default function LinkedIn6Page() {
  return <LinkedIn6View />;
}
