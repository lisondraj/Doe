"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

import { BlogLandingPostCard } from "@/components/blog/BlogLandingPostCard";
import { BLOG_LANDING_POSTS } from "@/lib/blog/blog-landing-posts";
import {
  BLOG_HOME_DESKTOP_CAROUSEL_INITIAL_INDEX,
  homeBlogCarouselPostsDesktop,
  homeBlogCarouselPostsMobile,
} from "@/lib/blog/blog-home-carousel-posts";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

function carouselPosts({
  oldestFirst,
  homeFeatured,
  homeDesktop,
}: {
  oldestFirst: boolean;
  homeFeatured: boolean;
  homeDesktop: boolean;
}) {
  if (homeFeatured) {
    return homeDesktop ? homeBlogCarouselPostsDesktop() : homeBlogCarouselPostsMobile();
  }

  return oldestFirst ? [...BLOG_LANDING_POSTS].reverse() : BLOG_LANDING_POSTS;
}

/** Horizontal swipe carousel of all featured blog posts — /blog card design. */
export function BlogFeaturedCarousel({
  oldestFirst = false,
  homeFeatured = false,
}: { oldestFirst?: boolean; homeFeatured?: boolean } = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [homeDesktop, setHomeDesktop] = useState(
    () => homeFeatured && readBootstrappedDoePhoneVariant() === "desktop",
  );
  const posts = carouselPosts({ oldestFirst, homeFeatured, homeDesktop });

  useLayoutEffect(() => {
    if (!homeFeatured) return undefined;

    const syncVariant = () => setHomeDesktop(resolveDoePhoneVariant() === "desktop");
    syncVariant();

    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", syncVariant);
    return () => mq.removeEventListener("change", syncVariant);
  }, [homeFeatured]);

  useLayoutEffect(() => {
    if (!homeFeatured || !homeDesktop) return undefined;

    const scroll = scrollRef.current;
    if (!scroll) return undefined;

    const syncScroll = () => {
      const firstSlide = scroll.querySelector<HTMLElement>(".blog-article-related-carousel__slide");
      const track = scroll.querySelector<HTMLElement>(".blog-article-related-carousel__track");
      if (!firstSlide || !track) return;

      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
      const step = firstSlide.offsetWidth + gap;
      scroll.scrollLeft = step * BLOG_HOME_DESKTOP_CAROUSEL_INITIAL_INDEX;
    };

    syncScroll();
    const ro = new ResizeObserver(syncScroll);
    ro.observe(scroll);
    window.addEventListener("resize", syncScroll);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncScroll);
    };
  }, [homeDesktop, homeFeatured, posts.length]);

  return (
    <section
      className={`blog-article-related-carousel${homeFeatured ? " blog-article-related-carousel--home-featured" : ""}`}
      aria-label="From the blog"
    >
      <div ref={scrollRef} className="blog-article-related-carousel__scroll">
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
