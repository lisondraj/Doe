import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  PULSE_AMBIENT_ARTICLE,
  PULSE_AMBIENT_EXCERPT,
  PULSE_AMBIENT_PATH,
  PULSE_AMBIENT_TITLE,
} from "@/lib/blog/pulse-ambient-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${PULSE_AMBIENT_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: PULSE_AMBIENT_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${PULSE_AMBIENT_PATH}`,
  },
};

export default function PulseAmbientPage() {
  return <AboutStyleArticleRouter article={PULSE_AMBIENT_ARTICLE} />;
}
