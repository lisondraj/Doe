"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import {
  MOBILE_NAV_FOOTER_SLIDES,
  MobileNavFooterShapeIcon,
} from "@/components/doe-nav-data";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function appViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

const narrowHorizontalInset =
  "iphone-page:pl-[max(2rem,calc(env(safe-area-inset-left,0px)+1.5rem))] iphone-page:pr-[max(2rem,calc(env(safe-area-inset-right,0px)+1.5rem))]";

/** Preview copy aligned with each nav footer slide (outside text = post title). */
const SLIDE_PREVIEWS: Record<string, readonly string[]> = {
  Inquisara: [
    "How we assembled a clinical and product team around one question: what would actually help at the point of care? Inquisara began as a working name for an internal prototype—a place to argue about triage rules, notification policy, and what “good” looks like when an assistant drafts in Epic-adjacent workflows.",
    "This essay traces the early trade-offs: speed versus safety, delight versus trust, and why we refused to ship a demo that couldn’t survive a nursing handoff. You’ll meet the founders’ bets on small, verifiable wins before we ever said the word platform.",
    "If you only read one section, jump to where we describe the “inbox contract”—how Doe summarizes messages so clinicians verify instead of babysit, and why that philosophy still defines Inquisara today.",
  ],
  "Doe Ecosystem": [
    "Hospitals, education, and startups don’t have to compete for attention on the same dashboard. The Future of Medicine, for us, is wiring ambient AI across those worlds without flattening them into one bland UI: each surface inherits Doe’s guardrails, but keeps its native rhythms.",
    "We walk through three patterns we keep seeing: identity-aware handoffs, payer packets drafted with citations, and education tracks that reuse the same clinical graph the hospital trusts. None of this requires ripping out your EHR on day one.",
    "The hard part isn’t the model—it’s orchestration. Here’s how we think about interoperability patiently: events, audit trails, and human-in-the-loop defaults that survive a Joint Commission week and a med-student cram session in the same product family.",
  ],
  "For Students": [
    "From pre-clinical drill to residency handoff, students carry a different cognitive load than attendings—more context switching, less sleep, and a constant fear of missing the high-stakes signal in a haystack of PDFs.",
    "Doe Education isn’t another Q-bank bolt-on. We focus on structure you can feel: spaced prompts tied to learning objectives, simulations that fail safely, and feedback that cites sources so you can defend your reasoning on rounds.",
    "We close with a roadmap: how resident workflows will reconnect to the same Doe graph the hospital uses, so the habit you build in year two is the habit you’ll rely on when you’re the one signing the note.",
  ],
};

type Slide = (typeof MOBILE_NAV_FOOTER_SLIDES)[number];

function GradientArticleVisual({
  slide,
  variant,
}: {
  slide: Slide;
  variant: "hero" | "inline";
}) {
  const tall =
    variant === "hero"
      ? "min-h-[min(52vh,28rem)] iphone-page:min-h-[min(56dvh,30rem)]"
      : "min-h-[min(42vh,22rem)] iphone-page:min-h-[min(48dvh,24rem)]";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.5rem] iphone-page:rounded-[clamp(1.35rem,1.1rem+1.5vmin,2rem)] shadow-[0_16px_48px_rgba(0,0,0,0.14)] ${tall}`}
    >
      <div className="absolute inset-0" style={{ background: slide.gradient }} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: slide.lineOverlay.opacity,
          mixBlendMode: slide.lineOverlay.mixBlendMode,
          backgroundImage: slide.lineOverlay.backgroundImage,
        }}
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-7 iphone-page:p-[clamp(1.5rem,1rem+3.5vmin,3rem)]">
        <div
          className={`flex items-center gap-6 iphone-page:gap-[clamp(1.35rem,1rem+3vmin,3rem)] text-white ${inter.className}`}
        >
          <MobileNavFooterShapeIcon shape={slide.shape} />
          <span className="text-[clamp(2.15rem,7.5vw,4.25rem)] iphone-page:text-[clamp(2.35rem,8vw,4.5rem)] font-medium tracking-tight leading-none">
            {slide.boxTitle}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArticleBlock({ slide, isFirst }: { slide: Slide; isFirst: boolean }) {
  const previewParas = SLIDE_PREVIEWS[slide.boxTitle] ?? [];

  return (
    <article
      className={
        isFirst
          ? "w-full"
          : "w-full pt-14 iphone-page:pt-16 mt-12 iphone-page:mt-14 border-t border-[#E6E6E6]"
      }
    >
      {!isFirst && (
        <div className="mb-8 iphone-page:mb-10">
          <GradientArticleVisual slide={slide} variant="inline" />
        </div>
      )}

      <div className="mt-8 iphone-page:mt-10 space-y-6 iphone-page:space-y-7">
        <p
          className={`text-[clamp(0.75rem,2.8vw,0.875rem)] font-semibold uppercase tracking-[0.2em] text-gray-500 ${inter.className}`}
        >
          {slide.boxTitle}
        </p>
        <h2
          className={`text-[clamp(2rem,6.5vw,3.25rem)] iphone-page:text-[clamp(2.25rem,7.25vw,3.5rem)] text-gray-900 tracking-tight leading-[1.12] ${lora.className}`}
        >
          {slide.outside}
        </h2>
        <p
          className={`text-[clamp(1.05rem,3.8vw,1.25rem)] iphone-page:text-[clamp(1.125rem,4.1vw,1.35rem)] text-gray-500 ${inter.className}`}
          style={{ fontWeight: 600 }}
        >
          {slide.date}
        </p>
        <div className={`space-y-5 iphone-page:space-y-6 text-[clamp(1.1rem,3.9vw,1.3rem)] iphone-page:text-[clamp(1.2rem,4.25vw,1.4rem)] leading-[1.65] text-gray-800 ${inter.className}`} style={{ fontWeight: 500 }}>
          {previewParas.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <button
          type="button"
          className={`group inline-flex items-center gap-2 border-0 bg-transparent p-0 text-left text-[clamp(1.05rem,3.6vw,1.2rem)] iphone-page:text-[clamp(1.1rem,3.85vw,1.25rem)] font-semibold text-[#1E343A] underline decoration-[#1E343A]/30 underline-offset-[0.35em] transition-colors hover:text-[#15282d] hover:decoration-[#15282d]/50 active:opacity-80 ${inter.className}`}
          aria-label="Read more"
        >
          <span>Read more</span>
          <span className="font-light text-[1.1em] leading-none tracking-normal text-[#1E343A]/80" aria-hidden>
            →
          </span>
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);

  useLayoutEffect(() => {
    const measure = () => {
      const { width, height } = appViewportPx();
      setViewportWidth(width);
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, []);

  const rootZoom = doeforvcRootZoom(viewportWidth);
  const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;

  const [first, ...rest] = MOBILE_NAV_FOOTER_SLIDES;

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden doeforvc-iphone-root"
      style={{
        backgroundColor: "#F7F6F3",
        ...(applyRootZoom ? { zoom: rootZoom } : {}),
      }}
      suppressHydrationWarning
    >
      <DoeIphoneSiteNav />

      <main
        className={`relative z-10 w-full max-w-[min(100%,52rem)] mx-auto pt-[5.5rem] iphone-page:pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4rem))] pb-20 iphone-page:pb-24 ${narrowHorizontalInset}`}
      >
        <Link
          href="/"
          className={`inline-flex items-center gap-2.5 mb-8 iphone-page:mb-10 text-[clamp(1rem,3.5vw,1.125rem)] iphone-page:text-[clamp(1.05rem,3.65vw,1.2rem)] font-semibold text-gray-600 hover:text-gray-900 ${inter.className}`}
        >
          <svg
            className="w-5 h-5 iphone-page:w-6 iphone-page:h-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>

        {/* Inquisara at top: image first, then title / preview / Read more */}
        <div className="w-full">
          <GradientArticleVisual slide={first} variant="hero" />
          <ArticleBlock slide={first} isFirst />
        </div>

        {rest.map((slide) => (
          <ArticleBlock key={slide.boxTitle} slide={slide} isFirst={false} />
        ))}
      </main>
    </div>
  );
}
