import type { Metadata } from "next";

import { DoeHealthNewsPage } from "@/components/doehealth-blog/DoeHealthNewsPage";
import { DOEHEALTH_BLOG_ARTICLES } from "@/lib/doehealth/doehealth-blog-articles";
import { doehealthDeskInitialVariant } from "@/lib/doehealth/doehealth-desk-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News · Doe",
  description: "Writing from the founders on healthcare, personal agents, and building Doe.",
};

export default function NewsRoute() {
  return <DoeHealthNewsPage articles={DOEHEALTH_BLOG_ARTICLES} initialVariant={doehealthDeskInitialVariant()} />;
}
