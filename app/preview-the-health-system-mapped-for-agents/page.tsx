import { DoeHealthBlogPreviewRoute, previewArticleMetadata } from "@/components/doehealth-blog/DoeHealthBlogPreviewRoute";

const SLUG = "the-health-system-mapped-for-agents";

export const dynamic = "force-dynamic";

export const metadata = previewArticleMetadata(SLUG);

export default function PreviewArticlePage() {
  return <DoeHealthBlogPreviewRoute slug={SLUG} />;
}
