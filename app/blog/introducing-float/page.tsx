import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTRODUCING_FLOAT_ARTICLE,
  INTRODUCING_FLOAT_EXCERPT,
  INTRODUCING_FLOAT_PATH,
  INTRODUCING_FLOAT_TITLE,
} from "@/lib/blog/introducing-float-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${INTRODUCING_FLOAT_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTRODUCING_FLOAT_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTRODUCING_FLOAT_PATH}`,
  },
};

export default function IntroducingFloatPage() {
  return <AboutStyleArticleRouter article={INTRODUCING_FLOAT_ARTICLE} />;
}
