import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoeHealthBlogPage } from "@/components/doehealth-blog/DoeHealthBlogPage";
import { doehealthBlogArticle, doehealthBlogTitle } from "@/lib/doehealth/doehealth-blog-articles";
import type { PreviewArticleSlug } from "@/lib/doehealth/doehealth-preview-articles";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

import "@/lib/doehealth/doehealth-desk.css";
import "@/lib/doehealth/doehealth-blog.css";
import "@/lib/doehealth/doehealth-careers.css";
import "@/lib/doehealthdesk2/doehealthdesk2.css";

export function previewArticleMetadata(slug: PreviewArticleSlug): Metadata {
  const article = doehealthBlogArticle(slug);
  if (!article) return {};
  return { title: `Doe | ${doehealthBlogTitle(article)}`, description: article.excerpt };
}

/** A `/preview-<slug>` page: the /news article in /earlypreview's chrome. */
export function DoeHealthBlogPreviewRoute({ slug }: { slug: PreviewArticleSlug }) {
  const article = doehealthBlogArticle(slug);
  if (!article) notFound();
  return <DoeHealthBlogPage article={article} initialVariant={doehealthDesk2InitialVariant()} preview />;
}
