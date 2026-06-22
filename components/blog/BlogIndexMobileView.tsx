"use client";

import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  BLOG_BODY_COPY_TW,
  BLOG_CARD_STACK,
  BLOG_CARD_TITLE_TW,
  BLOG_CONTENT_PT,
  BLOG_META_TW,
  BLOG_PAGE_TITLE_TW,
  BLOG_STACK_GAP,
  BLOG_TITLE_VISUAL_GAP,
} from "@/lib/blog/blog-layout-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

export function BlogIndexMobileView() {
  return (
    <BlogMobileShell>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <h1 className={BLOG_PAGE_TITLE_TW}>
          <span className="block">Blog</span>
        </h1>
        <p className={BLOG_BODY_COPY_TW}>
          Notes on building AI for healthcare teams.
        </p>

        <ul className={`flex w-full flex-col ${BLOG_TITLE_VISUAL_GAP}`}>
          {BLOG_ARTICLES.map((article, index) => (
            <li
              key={article.slug}
              className={index > 0 ? BLOG_STACK_GAP : ""}
            >
              <Link href={`/blog/${article.slug}`} className="group block no-underline">
                <div className={BLOG_CARD_STACK}>
                  <BlogHeroVisual backdrop={article.backdrop} variant="list" />
                  <h2
                    className={`${BLOG_CARD_TITLE_TW} transition-colors group-hover:text-[#1E343A]`}
                  >
                    {article.title}
                  </h2>
                  <p className={BLOG_META_TW}>
                    {article.author}
                    <span className="mx-2 text-[#9CA3AF]" aria-hidden>
                      ·
                    </span>
                    {article.date}
                  </p>
                  <p className={`${BLOG_BODY_COPY_TW} !mt-0 line-clamp-4`}>{article.body[0]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </BlogMobileShell>
  );
}
