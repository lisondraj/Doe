import { BLOG_LANDING_LIST_DIVIDER_LINE } from "@/lib/blog/blog-landing-layout-styles";

/** Rule between the related-post carousel and the email invite panel. */
export function BlogArticleCarouselDivider() {
  return (
    <div className="blog-article-carousel-divider" aria-hidden>
      <div className={BLOG_LANDING_LIST_DIVIDER_LINE} />
    </div>
  );
}
