"use client";

import { renderArticleBlock } from "@/components/blog/ArticleBodyBlocks";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  BLOG_ARTICLE_TITLE_TW,
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
        <p className={`text-center ${BLOG_EYEBROW_TW}`}>{article.eyebrow}</p>

        <h1 className={`${BLOG_ARTICLE_TITLE_TW} mt-6`}>{article.title}</h1>

        <p className={`mt-4 text-center ${BLOG_META_TW}`}>
          {article.author}
          <span className="mx-2 text-[#9CA3AF]" aria-hidden>
            ·
          </span>
          {article.date}
        </p>

        <BlogHeroVisual backdrop={article.backdrop} variant="hero" />

        <div className={`article-body ${BLOG_TITLE_VISUAL_GAP} text-left`}>
          {article.body.map((block, index) => renderArticleBlock(block, index))}
        </div>
      </main>
    </BlogMobileShell>
  );
}
