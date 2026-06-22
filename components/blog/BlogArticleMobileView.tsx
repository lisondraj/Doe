"use client";

import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  BLOG_ARTICLE_BODY_TW,
  BLOG_ARTICLE_TITLE_TW,
  BLOG_BODY_COPY_TW,
  BLOG_CONTENT_PT,
  BLOG_EYEBROW_TW,
  BLOG_META_TW,
  BLOG_TITLE_VISUAL_GAP,
} from "@/lib/blog/blog-layout-styles";
import type { BlogArticle } from "@/lib/blog/articles";

export function BlogArticleMobileView({ article }: { article: BlogArticle }) {
  return (
    <BlogMobileShell>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <Link
          href="/blog"
          className={`inline-block transition-colors hover:text-[#374151] ${BLOG_EYEBROW_TW}`}
        >
          Blog
        </Link>

        <p className={`mt-6 text-center ${BLOG_EYEBROW_TW}`}>{article.eyebrow}</p>

        <h1 className={`${BLOG_ARTICLE_TITLE_TW} mt-6`}>
          {article.title}
        </h1>

        <p className={`mt-4 text-center ${BLOG_META_TW}`}>
          {article.author}
          <span className="mx-2 text-[#9CA3AF]" aria-hidden>
            ·
          </span>
          {article.date}
        </p>

        <BlogHeroVisual backdrop={article.backdrop} variant="hero" />

        <div className={`article-body ${BLOG_TITLE_VISUAL_GAP} space-y-[clamp(0.85rem,0.65rem+0.9vmin,1.35rem)] iphone-page:space-y-[clamp(1rem,0.75rem+1.05vmin,1.55rem)] text-left`}>
          {article.body.map((paragraph, index) => (
            <p key={index} className={BLOG_ARTICLE_BODY_TW}>
              {paragraph}
            </p>
          ))}
        </div>

        <p className={`article-body mt-[clamp(0.85rem,0.65rem+0.9vmin,1.35rem)] text-left ${BLOG_BODY_COPY_TW}`}>
          Learn more on the{" "}
          <a
            href="#"
            className="font-medium text-[#1E343A] underline decoration-[#1E343A]/35 underline-offset-[0.28em] transition-colors hover:decoration-[#1E343A]/60"
          >
            changelog
          </a>
          .
        </p>
      </main>
    </BlogMobileShell>
  );
}
