import type { Metadata } from "next";

import { LinkedInShaderView } from "@/components/linkedin/LinkedInShaderView";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN_PATH = "/linkedin";

export const metadata: Metadata = {
  title: "LinkedIn · Doe",
  description: "Doe LinkedIn shader background.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN_PATH}`,
  },
};

export default function LinkedInPage() {
  return <LinkedInShaderView />;
}
