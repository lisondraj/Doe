import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTRODUCING_FABRIC_ARTICLE,
  INTRODUCING_FABRIC_EXCERPT,
  INTRODUCING_FABRIC_PATH,
  INTRODUCING_FABRIC_TITLE,
} from "@/lib/blog/introducing-fabric-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${INTRODUCING_FABRIC_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTRODUCING_FABRIC_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTRODUCING_FABRIC_PATH}`,
  },
};

export default function IntroducingFabricPage() {
  return <AboutStyleArticleRouter article={INTRODUCING_FABRIC_ARTICLE} />;
}
