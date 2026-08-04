import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";
import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/about/about-doehealth-iphone.css";
import "@/lib/blog/home-blog-featured-carousel.css";

/** Blog preview carousel + rule — same chrome as article-page footer carousel band. */
export function HomeBlogFeaturedCarouselSection() {
  return (
    <section className="home-blog-featured-carousel" aria-label="Blog">
      <BlogArticleCarouselDivider />
      <BlogFeaturedCarousel />
    </section>
  );
}
