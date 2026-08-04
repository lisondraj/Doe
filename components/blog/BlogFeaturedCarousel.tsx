import Link from "next/link";

import { BlogLandingPostCard } from "@/components/blog/BlogLandingPostCard";
import { BLOG_LANDING_POSTS } from "@/lib/blog/blog-landing-posts";

/** Horizontal swipe carousel of all featured blog posts — /blog card design. */
export function BlogFeaturedCarousel() {
  return (
    <section className="blog-article-related-carousel" aria-label="From the blog">
      <div className="blog-article-related-carousel__scroll">
        <ul className="blog-article-related-carousel__track m-0 list-none p-0">
          {BLOG_LANDING_POSTS.map((post) => (
            <li key={post.slug} className="blog-article-related-carousel__slide">
              <Link href={post.path} className="group block h-full no-underline">
                <BlogLandingPostCard post={post} linked={false} previewContext="carousel" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
