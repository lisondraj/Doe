import type { ReactNode } from "react";

import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";

type BlogArticleFooterCarouselBandProps = {
  children: ReactNode;
};

/** Rule + related-post carousel — shared by article footers and the home featured band. */
export function BlogArticleFooterCarouselBand({ children }: BlogArticleFooterCarouselBandProps) {
  return (
    <div className="blog-article-footer-carousel-band">
      <BlogArticleCarouselDivider />
      {children}
    </div>
  );
}
