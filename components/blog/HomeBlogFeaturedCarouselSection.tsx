import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/about/about-doehealth-iphone.css";

/** Home main page — featured blog carousel at the bottom of the brown stack. */
export function HomeBlogFeaturedCarouselSection() {
  return (
    <section className="home-blog-featured-carousel" aria-label="Blog">
      <div className="home-blog-featured-carousel__shell about-page-content">
        <BlogArticleFooterCarouselBand>
          <BlogFeaturedCarousel oldestFirst homeFeatured />
        </BlogArticleFooterCarouselBand>
      </div>
    </section>
  );
}
