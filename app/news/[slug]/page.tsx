import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoeHealthBlogPage } from "@/components/doehealth-blog/DoeHealthBlogPage";
import {
  doehealthBlogArticle,
  doehealthBlogTitle,
} from "@/lib/doehealth/doehealth-blog-articles";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

type RouteProps = { params: { slug: string } };

export function generateMetadata({ params }: RouteProps): Metadata {
  const article = doehealthBlogArticle(params.slug);
  if (!article) return {};
  return {
    title: `Doe News | ${doehealthBlogTitle(article)}`,
    description: article.excerpt,
  };
}

export default function DoeHealthBlogArticleRoute({ params }: RouteProps) {
  const article = doehealthBlogArticle(params.slug);
  if (!article) notFound();
  return <DoeHealthBlogPage article={article} initialVariant={doehealthDesk2InitialVariant()} />;
}
