import type { Metadata } from "next";

import { DoeHealthNewsPage } from "@/components/doehealth-blog/DoeHealthNewsPage";
import { DOEHEALTH_BLOG_ARTICLES } from "@/lib/doehealth/doehealth-blog-articles";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News · Doe",
  description: "Writing from the founders on healthcare, personal agents, and building Doe.",
};

export default function NewsRoute() {
  return <DoeHealthNewsPage articles={DOEHEALTH_BLOG_ARTICLES} initialVariant={doehealthDesk2InitialVariant()} />;
}
