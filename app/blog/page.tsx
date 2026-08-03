import type { Metadata } from "next";

import { BlogLandingRouter } from "@/components/blog/BlogLandingRouter";
import {
  BLOG_LANDING_PATH,
  BLOG_LANDING_SUBHEADING,
  BLOG_LANDING_TITLE,
} from "@/lib/blog/blog-landing-posts";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${BLOG_LANDING_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: BLOG_LANDING_SUBHEADING,
  alternates: {
    canonical: `${primarySiteOrigin()}${BLOG_LANDING_PATH}`,
  },
};

export default function BlogPage() {
  return <BlogLandingRouter />;
}
