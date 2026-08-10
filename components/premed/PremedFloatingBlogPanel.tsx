"use client";

import Link from "next/link";

import { BLOG_LANDING_POSTS, BLOG_LANDING_TITLE } from "@/lib/blog/blog-landing-posts";
import { premedBlogPanelDescription } from "@/lib/premed/premed-blog-preview-copy";

type PremedFloatingBlogPanelProps = {
  currentSlug?: string;
  onItemClick?: () => void;
};

/** /premed — blog index panel with vague preview lines instead of detailed excerpts. */
export function PremedFloatingBlogPanel({
  currentSlug,
  onItemClick,
}: PremedFloatingBlogPanelProps) {
  return (
    <div className="about-style-article-floating-blog-nav__list-wrap">
      <div className="about-style-article-floating-blog-nav__scroll">
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
                  <span className="about-style-article-floating-blog-nav__link-date">
                    {premedBlogPanelDescription(post.slug)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
