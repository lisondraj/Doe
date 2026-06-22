"use client";

import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { BLOG_ARTICLES } from "@/lib/blog/articles";
import { lora, suisseIntl } from "@/lib/home/fonts";

export function BlogIndexMobileView() {
  return (
    <BlogMobileShell>
      <main
        className={`mx-auto w-full max-w-[min(100%,42rem)] pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))] ${suisseIntl.className}`}
      >
        <h1
          className={`text-center text-[clamp(2.85rem,10.5vw,4.65rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#111827] ${lora.className}`}
        >
          Blog
        </h1>
        <p className="mx-auto mt-5 max-w-[min(100%,34rem)] text-center text-[clamp(1.15rem,3.9vw,1.45rem)] font-light leading-[1.5] text-[#374151]">
          Notes on building AI for healthcare teams.
        </p>

        <ul className="mx-auto mt-14 flex w-full max-w-[min(100%,38rem)] flex-col gap-0">
          {BLOG_ARTICLES.map((article, index) => (
            <li
              key={article.slug}
              className={index > 0 ? "border-t border-[#E6E6E6] pt-10 mt-10" : ""}
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group block text-center no-underline"
              >
                <BlogHeroVisual backdrop={article.backdrop} variant="list" />
                <h2 className="mx-auto mt-6 max-w-[min(100%,34rem)] text-[clamp(1.65rem,5.5vw,2.35rem)] font-normal leading-[1.08] tracking-[-0.03em] text-[#111827] transition-colors group-hover:text-[#1E343A]">
                  {article.title}
                </h2>
                <p className="mx-auto mt-3 max-w-[min(100%,34rem)] text-[clamp(1rem,3.4vw,1.15rem)] font-semibold text-[#6B7280]">
                  {article.author}
                  <span className="mx-2 text-[#9CA3AF]" aria-hidden>
                    ·
                  </span>
                  {article.date}
                </p>
                <p className="mx-auto mt-4 max-w-[min(100%,34rem)] line-clamp-4 text-[clamp(1.05rem,3.6vw,1.25rem)] font-light leading-[1.55] text-[#374151]">
                  {article.body[0]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </BlogMobileShell>
  );
}
