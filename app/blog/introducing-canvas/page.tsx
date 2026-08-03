import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTRODUCING_CANVAS_ARTICLE,
  INTRODUCING_CANVAS_EXCERPT,
  INTRODUCING_CANVAS_PATH,
  INTRODUCING_CANVAS_TITLE,
} from "@/lib/blog/introducing-canvas-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${INTRODUCING_CANVAS_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTRODUCING_CANVAS_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTRODUCING_CANVAS_PATH}`,
  },
};

export default function IntroducingCanvasPage() {
  return <AboutStyleArticleRouter article={INTRODUCING_CANVAS_ARTICLE} />;
}
