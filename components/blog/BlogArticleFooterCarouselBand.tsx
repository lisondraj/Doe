import type { ReactNode } from "react";

import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";

type BlogArticleFooterCarouselBandProps = {
  children: ReactNode;
  /** Default `above` — article footers. Home hero band uses `below`. */
  dividerPosition?: "above" | "below" | "both" | "none";
};

/** Rule + related-post carousel — shared by article footers and the home featured band. */
export function BlogArticleFooterCarouselBand({
  children,
  dividerPosition = "above",
}: BlogArticleFooterCarouselBandProps) {
  const divider = <BlogArticleCarouselDivider />;

  return (
    <div className="blog-article-footer-carousel-band">
      {dividerPosition === "above" || dividerPosition === "both" ? divider : null}
      {children}
      {dividerPosition === "below" || dividerPosition === "both" ? divider : null}
    </div>
  );
}
