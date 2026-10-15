import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoeHealthBlogPage } from "@/components/doehealth-blog/DoeHealthBlogPage";
import {
  doehealthBlogArticle,
  doehealthBlogTitle,
} from "@/lib/doehealth/doehealth-blog-articles";
import { doehealthDeskInitialVariant } from "@/lib/doehealth/doehealth-desk-initial-variant";

export const dynamic = "force-dynamic";

type RouteProps = { params: { slug: string } };

export function generateMetadata({ params }: RouteProps): Metadata {
  const article = doehealthBlogArticle(params.slug);
  if (!article) return {};
  return {
    title: `${doehealthBlogTitle(article)} · Doe`,
    description: article.excerpt,
  };
}

export default function DoeHealthBlogArticleRoute({ params }: RouteProps) {
  const article = doehealthBlogArticle(params.slug);
  if (!article) notFound();
  return <DoeHealthBlogPage article={article} initialVariant={doehealthDeskInitialVariant()} />;
}
