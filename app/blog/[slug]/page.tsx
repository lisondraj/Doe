import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { BlogArticleMobileView } from "@/components/blog/BlogArticleMobileView";
import { BlogRouter } from "@/components/blog/BlogRouter";
import { getBlogArticle } from "@/lib/blog/articles";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getBlogArticle(params.slug);
  if (!article) notFound();

  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  return (
    <BlogRouter initialVariant={initialVariant}>
      <BlogArticleMobileView article={article} />
    </BlogRouter>
  );
}
