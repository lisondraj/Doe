import { DoeHealthBlogPreviewRoute, previewArticleMetadata } from "@/components/doehealth-blog/DoeHealthBlogPreviewRoute";

const SLUG = "compliance-and-security-through-seed";

export const dynamic = "force-dynamic";

export const metadata = previewArticleMetadata(SLUG);

export default function PreviewArticlePage() {
  return <DoeHealthBlogPreviewRoute slug={SLUG} />;
}
