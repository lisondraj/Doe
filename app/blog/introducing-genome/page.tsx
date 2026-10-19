import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTRODUCING_GENOME_ARTICLE,
  INTRODUCING_GENOME_EXCERPT,
  INTRODUCING_GENOME_PATH,
  INTRODUCING_GENOME_TITLE,
} from "@/lib/blog/introducing-genome-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `Doe Blog | ${INTRODUCING_GENOME_TITLE}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTRODUCING_GENOME_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTRODUCING_GENOME_PATH}`,
  },
};

export default function IntroducingGenomePage() {
  return <AboutStyleArticleRouter article={INTRODUCING_GENOME_ARTICLE} />;
}
