"use client";

import Link from "next/link";

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
  BLOG_LIST_SECTION_GAP,
  BLOG_META_TW,
  BLOG_READ_MORE_TW,
} from "@/lib/blog/blog-layout-styles";
import { dmSans } from "@/lib/home/fonts";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

function BlogReadMoreArrow() {
  return (
    <svg
      className="h-4 w-4 shrink-0 iphone-page:h-[0.95rem] iphone-page:w-[0.95rem]"
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

        <ul className={`${BLOG_LIST_SECTION_GAP} flex w-full flex-col`}>
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

        <div className={`${BLOG_LIST_SECTION_GAP} flex w-full justify-center`}>
          <a
            href="#"
            className={`font-medium leading-none text-[#1E343A] transition-opacity active:opacity-60 text-[1.32rem] iphone-page:text-[1.52rem] ${dmSans.className}`}
          >
            See more ({BLOG_ARTICLES.length})
          </a>
        </div>
      </main>
    </BlogMobileShell>
  );
}
