import { DoeHealthBlogPreviewRoute, previewArticleMetadata } from "@/components/doehealth-blog/DoeHealthBlogPreviewRoute";

const SLUG = "the-new-front-door-for-aesthetic-care";

export const dynamic = "force-dynamic";

export const metadata = previewArticleMetadata(SLUG);

export default function PreviewArticlePage() {
  return <DoeHealthBlogPreviewRoute slug={SLUG} />;
}
