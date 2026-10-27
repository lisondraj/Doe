import { DoeHealthBlogPreviewRoute, previewArticleMetadata } from "@/components/doehealth-blog/DoeHealthBlogPreviewRoute";

const SLUG = "healthcare-in-the-era-of-personal-agents";

export const dynamic = "force-dynamic";

export const metadata = previewArticleMetadata(SLUG);

export default function PreviewArticlePage() {
  return <DoeHealthBlogPreviewRoute slug={SLUG} />;
}
