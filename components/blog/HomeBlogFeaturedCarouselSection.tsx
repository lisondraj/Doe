import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/about/about-doehealth-iphone.css";

type HomeBlogFeaturedCarouselSectionProps = {
  /** @default "belowHero" — large top inset for under the hero; "pageBottom" for end-of-page placement. */
  placement?: "belowHero" | "pageBottom";
};

/** Home / doehealth — featured blog carousel band. */
export function HomeBlogFeaturedCarouselSection({
  placement = "belowHero",
}: HomeBlogFeaturedCarouselSectionProps) {
  const placementClass =
    placement === "pageBottom"
      ? "home-blog-featured-carousel--page-bottom"
      : "home-blog-featured-carousel--below-hero";

  return (
    <section className={`home-blog-featured-carousel ${placementClass}`} aria-label="Blog">
      <div className="home-blog-featured-carousel__shell about-page-content">
        <BlogArticleFooterCarouselBand dividerPosition="below">
          <BlogFeaturedCarousel oldestFirst homeFeatured />
        </BlogArticleFooterCarouselBand>
      </div>
    </section>
  );
}
