import type { Metadata } from "next";

import { DoeHealthBlogPage } from "@/components/doehealth-blog/DoeHealthBlogPage";
import {
  DOEHEALTH_BLOG_FEATURED,
  doehealthBlogTitle,
} from "@/lib/doehealth/doehealth-blog-articles";
import { doehealthDeskInitialVariant } from "@/lib/doehealth/doehealth-desk-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${doehealthBlogTitle(DOEHEALTH_BLOG_FEATURED)} · Doe`,
  description: DOEHEALTH_BLOG_FEATURED.excerpt,
};

export default function DoeHealthBlogRoute() {
  return (
    <DoeHealthBlogPage article={DOEHEALTH_BLOG_FEATURED} initialVariant={doehealthDeskInitialVariant()} />
  );
}
