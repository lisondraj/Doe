import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  GENOME_IS_BUILT_FOR_YOU_ARTICLE,
  GENOME_IS_BUILT_FOR_YOU_EXCERPT,
  GENOME_IS_BUILT_FOR_YOU_PATH,
  GENOME_IS_BUILT_FOR_YOU_TITLE,
} from "@/lib/blog/genome-is-built-for-you-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${GENOME_IS_BUILT_FOR_YOU_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: GENOME_IS_BUILT_FOR_YOU_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${GENOME_IS_BUILT_FOR_YOU_PATH}`,
  },
};

export default function GenomeIsBuiltForYouPage() {
  return <AboutStyleArticleRouter article={GENOME_IS_BUILT_FOR_YOU_ARTICLE} />;
}
