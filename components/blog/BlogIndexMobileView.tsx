"use client";

import Link from "next/link";

import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHero } from "@/components/blog/BlogLandingHero";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  BLOG_CARD_STACK,
  BLOG_CONTENT_PT,
  BLOG_LANDING_CARD_TITLE_TW,
  BLOG_LANDING_EXCERPT_TW,
  BLOG_LANDING_TITLE_META_GAP,
  BLOG_LIST_DIVIDER_LINE,
  BLOG_LIST_DIVIDER_WRAP,
  BLOG_META_TW,
  BLOG_READ_MORE_TW,
} from "@/lib/blog/blog-layout-styles";
import { dmSans } from "@/lib/home/fonts";
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

        <div
          aria-hidden
          className="mt-12 iphone-page:mt-[clamp(2.5rem,2rem+2.5vmin,4rem)] h-px w-full bg-[#9A8F82]"
        />
        <div className="py-6 iphone-page:py-[clamp(1.25rem,1rem+1.25vmin,2rem)]">
          <BlogFilterBar />
        </div>
        <div
          aria-hidden
          className="mb-12 iphone-page:mb-[clamp(2.5rem,2rem+2.5vmin,4rem)] h-px w-full bg-[#9A8F82]"
        />

        <ul className="flex w-full flex-col">
          {BLOG_ARTICLES.slice(0, 3).map((article, index) => (
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
                    <p className={`${BLOG_LANDING_EXCERPT_TW} !mt-3 line-clamp-2`}>
                      {article.body[0].type === "p" || article.body[0].type === "p-link" ? article.body[0].text : ""}
                    </p>
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

        {/* ── See all footer ───────────────────────────────────── */}
        <div
          aria-hidden
          className="mt-12 iphone-page:mt-[clamp(2.5rem,2rem+2.5vmin,4rem)] h-px w-full bg-[#9A8F82]"
        />
        <div className="flex w-full items-baseline justify-center py-6 iphone-page:py-[clamp(1.25rem,1rem+1.25vmin,2rem)]">
          <a
            href="#"
            className={`inline-flex items-center gap-[0.3em] font-medium leading-none text-[#1E343A] transition-opacity active:opacity-60 text-[clamp(1.75rem,6.5vw,2.6rem)] iphone-page:text-[clamp(2rem,1.55rem+2.85vmin,3.15rem)] ${dmSans.className}`}
          >
            {BLOG_ARTICLES.length} articles
            <svg
              className="h-[0.7em] w-[0.7em] shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8h9M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div
          aria-hidden
          className="h-px w-full bg-[#9A8F82]"
        />
      </main>
    </BlogMobileShell>
  );
}
