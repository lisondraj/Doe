import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/about/about-doehealth-iphone.css";

/** Home main page — featured blog carousel directly under the hero. */
export function HomeBlogFeaturedCarouselSection() {
  return (
    <section className="home-blog-featured-carousel home-blog-featured-carousel--below-hero" aria-label="Blog">
      <div className="home-blog-featured-carousel__shell about-page-content">
        <BlogFeaturedCarousel oldestFirst />
      </div>
    </section>
  );
}
