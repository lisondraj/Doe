"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { inter, lora } from "@/lib/home/fonts";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useEffect } from "react";

const BLOG_ARTICLE = {
  eyebrow: "Now / AI",
  title: "Code Intelligence for Doe Agent",
  author: "Karri Saarinen",
  date: "May 14, 2026",
  intro:
    "Doe Agent can now read your codebase and answer questions from the source itself. It can explain how a feature works, investigate likely causes behind a problem, and help teams understand the current implementation directly.",
} as const;

function BlogHeroVisual() {
  return (
    <div
      className="relative mx-auto mt-10 w-full max-w-[min(100%,38rem)] overflow-hidden rounded-[1.35rem] aspect-[4/3] shadow-[0_18px_56px_rgba(0,0,0,0.12)] iphone-page:mt-12 iphone-page:rounded-[clamp(1.25rem,1rem+1.4vmin,1.75rem)]"
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={DOEPHONE_HERO_BACKDROP}
        embedded
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export default function BlogPage() {
  useEffect(() => {
    const html = document.documentElement;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";
    const pinchViewport =
      "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

    html.setAttribute("data-doephone-pinching", "true");
    meta?.setAttribute("content", pinchViewport);

    return () => {
      html.removeAttribute("data-doephone-pinching");
      if (meta) {
        if (prevViewport) meta.setAttribute("content", prevViewport);
        else meta.removeAttribute("content");
      }
    };
  }, []);

  return (
    <>
      <DoeIphoneSiteNav pinchSafe />

      <div
        className="blog-page-root relative z-0 min-h-[100dvh] overflow-x-clip bg-[#F7F6F3] px-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))]"
        suppressHydrationWarning
      >
        <main className="mx-auto w-full max-w-[min(100%,42rem)] pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] pt-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.25rem))] text-center">
          <p
            className={`text-[clamp(1rem,3.4vw,1.2rem)] font-medium tracking-[0.02em] text-[#6B7280] ${inter.className}`}
          >
            {BLOG_ARTICLE.eyebrow}
          </p>

          <h1
            className={`mx-auto mt-6 max-w-[min(100%,36rem)] text-[clamp(2.85rem,10.5vw,4.65rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#111827] ${lora.className}`}
          >
            {BLOG_ARTICLE.title}
          </h1>

          <BlogHeroVisual />

          <p
            className={`mx-auto mt-10 max-w-[min(100%,34rem)] text-[clamp(1.05rem,3.6vw,1.3rem)] font-medium text-[#6B7280] ${inter.className}`}
          >
            {BLOG_ARTICLE.author}
            <span className="mx-2 text-[#9CA3AF]" aria-hidden>
              ·
            </span>
            {BLOG_ARTICLE.date}
          </p>

          <p
            className={`mx-auto mt-12 max-w-[min(100%,36rem)] text-[clamp(1.45rem,5vw,1.95rem)] font-normal italic leading-[1.55] tracking-[-0.01em] text-[#1F2937] ${lora.className}`}
          >
            {BLOG_ARTICLE.intro}
          </p>

          <p
            className={`mx-auto mt-10 max-w-[min(100%,36rem)] text-[clamp(1.15rem,3.9vw,1.45rem)] font-normal leading-[1.5] text-[#374151] ${inter.className}`}
          >
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
      </div>
    </>
  );
}
