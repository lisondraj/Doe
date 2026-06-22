"use client";

import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { lora, suisseIntl } from "@/lib/home/fonts";
import type { BlogArticle } from "@/lib/blog/articles";

export function BlogArticleMobileView({ article }: { article: BlogArticle }) {
  return (
    <BlogMobileShell>
      <main
        className={`mx-auto w-full max-w-[min(100%,42rem)] pb-4 pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))] ${suisseIntl.className}`}
      >
        <Link
          href="/blog"
          className="inline-block text-[clamp(1rem,3.4vw,1.15rem)] font-medium tracking-[0.02em] text-[#6B7280] transition-colors hover:text-[#374151]"
        >
          Blog
        </Link>

        <p className="mt-6 text-center text-[clamp(1rem,3.4vw,1.2rem)] font-medium tracking-[0.02em] text-[#6B7280]">
          {article.eyebrow}
        </p>

        <h1
          className={`mx-auto mt-6 max-w-[min(100%,36rem)] text-center text-[clamp(2.85rem,10.5vw,4.65rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#111827] ${lora.className}`}
        >
          {article.title}
        </h1>

        <BlogHeroVisual backdrop={article.backdrop} />

        <p className="mx-auto mt-10 max-w-[min(100%,34rem)] text-center text-[clamp(1.05rem,3.6vw,1.3rem)] font-semibold text-[#6B7280]">
          {article.author}
          <span className="mx-2 text-[#9CA3AF]" aria-hidden>
            ·
          </span>
          {article.date}
        </p>

        <p className="article-body mt-12 max-w-[min(100%,36rem)] text-left text-[clamp(1.45rem,5vw,1.95rem)] font-light leading-[1.55] tracking-[-0.01em] text-[#1F2937]">
          {article.intro}
        </p>

        <p className="article-body mt-10 max-w-[min(100%,36rem)] text-left text-[clamp(1.15rem,3.9vw,1.45rem)] font-light leading-[1.5] text-[#374151]">
          Learn more on the{" "}
          <a
            href="#"
            className="font-medium text-[#111827] underline decoration-[#111827]/35 underline-offset-[0.28em] transition-colors hover:decoration-[#111827]/60"
          >
            changelog
          </a>
          .
        </p>
      </main>
    </BlogMobileShell>
  );
}
