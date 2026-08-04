import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/about/about-doehealth-iphone.css";

/** Home main page — same footer carousel band as blog articles (inherits brown stack bg). */
export function HomeBlogFeaturedCarouselSection() {
  return (
    <section className="home-blog-featured-carousel" aria-label="Blog">
      <BlogArticleFooterCarouselBand>
        <BlogFeaturedCarousel />
      </BlogArticleFooterCarouselBand>
    </section>
  );
}
