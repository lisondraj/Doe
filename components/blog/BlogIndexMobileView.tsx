"use client";

import Link from "next/link";

import { BlogLandingHero } from "@/components/blog/BlogLandingHero";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  BLOG_BODY_COPY_TW,
  BLOG_CARD_STACK,
  BLOG_CONTENT_PT,
  BLOG_LANDING_CARD_TITLE_TW,
  BLOG_LANDING_TITLE_META_GAP,
  BLOG_LIST_DIVIDER_LINE,
  BLOG_LIST_DIVIDER_WRAP,
  BLOG_META_TW,
  BLOG_READ_MORE_TW,
  BLOG_TITLE_VISUAL_GAP,
} from "@/lib/blog/blog-layout-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

function BlogReadMoreArrow() {
  return (
    <svg
      className="h-4 w-4 shrink-0 iphone-page:h-[clamp(0.9rem,0.8rem+0.5vmin,1.05rem)] iphone-page:w-[clamp(0.9rem,0.8rem+0.5vmin,1.05rem)]"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8h9M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlogIndexMobileView() {
  return (
    <BlogMobileShell>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <BlogLandingHero />

        <ul className={`flex w-full flex-col ${BLOG_TITLE_VISUAL_GAP}`}>
          {BLOG_ARTICLES.map((article, index) => (
            <li key={article.slug}>
              {index > 0 ? (
                <div className={BLOG_LIST_DIVIDER_WRAP} aria-hidden>
                  <div className={BLOG_LIST_DIVIDER_LINE} />
                </div>
              ) : null}
              <Link href={`/blog/${article.slug}`} className="group block no-underline">
                <div className={BLOG_CARD_STACK}>
                  <BlogHeroVisual backdrop={article.backdrop} variant="list" />
                  <div>
                    <h2
                      className={`${BLOG_LANDING_CARD_TITLE_TW} transition-colors group-hover:text-[#1E343A]`}
                    >
                      {article.title}
                    </h2>
                    <p className={`${BLOG_META_TW} ${BLOG_LANDING_TITLE_META_GAP}`}>
                      {article.author}
                      <span className="mx-2 text-[#9CA3AF]" aria-hidden>
                        ·
                      </span>
                      {article.date}
                    </p>
                    <p className={`${BLOG_BODY_COPY_TW} !mt-3 line-clamp-2`}>{article.body[0]}</p>
                    <span className={`${BLOG_READ_MORE_TW} mt-2.5`}>
                      Read more
                      <BlogReadMoreArrow />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </BlogMobileShell>
  );
}
