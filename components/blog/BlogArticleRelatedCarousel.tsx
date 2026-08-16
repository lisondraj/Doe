import Link from "next/link";

import { BlogLandingPostCard } from "@/components/blog/BlogLandingPostCard";
import { getOtherBlogLandingPosts } from "@/lib/blog/blog-landing-posts";

type BlogArticleRelatedCarouselProps = {
  currentSlug: string;
  useBakedShaderBackdrops?: boolean;
};

/** Horizontal swipe carousel of other featured blog posts — /blog card design. */
export function BlogArticleRelatedCarousel({
  currentSlug,
  useBakedShaderBackdrops = false,
}: BlogArticleRelatedCarouselProps) {
  const posts = getOtherBlogLandingPosts(currentSlug);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="blog-article-related-carousel" aria-label="More from the blog">
      <div className="blog-article-related-carousel__scroll">
        <ul className="blog-article-related-carousel__track m-0 list-none p-0">
          {posts.map((post) => (
            <li key={post.slug} className="blog-article-related-carousel__slide">
              <Link href={post.path} className="group block h-full no-underline">
                <BlogLandingPostCard
                  post={post}
                  linked={false}
                  previewContext="carousel"
                  useBakedShaderBackdrops={useBakedShaderBackdrops}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
