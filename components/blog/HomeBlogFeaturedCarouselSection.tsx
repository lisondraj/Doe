import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";
import { BlogFeaturedCarousel } from "@/components/blog/BlogFeaturedCarousel";

import "@/lib/blog/home-blog-featured-carousel.css";

/** Blog preview carousel + rule above it — matches article-page footer carousel band. */
export function HomeBlogFeaturedCarouselSection() {
  return (
    <section className="home-blog-featured-carousel" aria-label="Blog">
      <div className="home-blog-featured-carousel__inner">
        <BlogArticleCarouselDivider />
        <BlogFeaturedCarousel />
      </div>
    </section>
  );
}
