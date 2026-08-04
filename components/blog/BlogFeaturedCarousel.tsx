import Link from "next/link";

import { BlogLandingPostCard } from "@/components/blog/BlogLandingPostCard";
import { BLOG_LANDING_POSTS } from "@/lib/blog/blog-landing-posts";

/** Horizontal swipe carousel of all featured blog posts — /blog card design. */
export function BlogFeaturedCarousel({
  oldestFirst = false,
  homeFeatured = false,
}: { oldestFirst?: boolean; homeFeatured?: boolean } = {}) {
  const posts = oldestFirst ? [...BLOG_LANDING_POSTS].reverse() : BLOG_LANDING_POSTS;

  return (
    <section
      className={`blog-article-related-carousel${homeFeatured ? " blog-article-related-carousel--home-featured" : ""}`}
      aria-label="From the blog"
    >
      <div className="blog-article-related-carousel__scroll">
        <ul className="blog-article-related-carousel__track m-0 list-none p-0">
          {posts.map((post) => (
            <li key={post.slug} className="blog-article-related-carousel__slide">
              <Link href={post.path} className="group block h-full no-underline">
                <BlogLandingPostCard
                  post={post}
                  linked={false}
                  previewContext={homeFeatured ? "home-carousel" : "carousel"}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
