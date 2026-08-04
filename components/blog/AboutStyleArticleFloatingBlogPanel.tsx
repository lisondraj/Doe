"use client";

import Link from "next/link";

import { BLOG_LANDING_POSTS, BLOG_LANDING_TITLE } from "@/lib/blog/blog-landing-posts";

type AboutStyleArticleFloatingBlogPanelProps = {
  currentSlug?: string;
  onItemClick?: () => void;
};

/** Scrollable single-column blog index — newest first. */
export function AboutStyleArticleFloatingBlogPanel({
  currentSlug,
  onItemClick,
}: AboutStyleArticleFloatingBlogPanelProps) {
  return (
    <div className="about-style-article-floating-blog-nav__list-wrap">
      <p className="about-style-article-floating-blog-nav__label">{BLOG_LANDING_TITLE}</p>

      <ol className="about-style-article-floating-blog-nav__list">
        {BLOG_LANDING_POSTS.map((post) => {
          const isCurrent = currentSlug === post.slug;

          return (
            <li key={post.slug}>
              <Link
                href={post.path}
                className={`about-style-article-floating-blog-nav__link${isCurrent ? " is-current" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onItemClick}
              >
                <span className="about-style-article-floating-blog-nav__link-title">{post.title}</span>
                <span className="about-style-article-floating-blog-nav__link-date">{post.date}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
