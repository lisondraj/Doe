"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import {
  MOBILE_NAV_FOOTER_SLIDES,
  MobileNavFooterShapeIcon,
} from "@/components/doe-nav-data";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { Inter, Lora } from "next/font/google";
import { useLayoutEffect } from "react";

/** Logical width baseline (~Plus/Pro-class iPhone CSS px) — zoom + type match SS reference across all phones */
const BLOG_LAYOUT_WIDTH_PX = 430;

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
      className={`relative w-full overflow-hidden rounded-[clamp(1.35rem,calc(1.1rem+430px_*_0.015),2rem)] shadow-[0_16px_48px_rgba(0,0,0,0.14)] ${tall}`}
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
      <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-[clamp(1.25rem,calc(0.85rem+430px_*_0.0229),2.75rem)]">
        <div
          className={`flex items-center gap-[clamp(1.35rem,calc(1rem+430px_*_0.03),3rem)] text-white ${inter.className}`}
        >
          <MobileNavFooterShapeIcon shape={slide.shape} />
          <span className="font-normal tracking-tight leading-none text-[clamp(2.35rem,calc(430px_*_0.08),4.5rem)]">
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
          className={`text-[clamp(0.75rem,calc(430px_*_0.028),0.875rem)] font-medium uppercase tracking-[0.2em] text-gray-500 ${inter.className}`}
        >
          {slide.boxTitle}
        </p>
        <h2
          className={`text-[clamp(2.25rem,calc(430px_*_0.0725),3.5rem)] text-gray-900 tracking-tight leading-[1.12] ${lora.className}`}
        >
          {slide.outside}
        </h2>
        <p
          className={`text-[clamp(1.125rem,calc(430px_*_0.041),1.35rem)] text-gray-500 font-medium ${inter.className}`}
        >
          {slide.date}
        </p>
        <div className={`space-y-6 text-[clamp(1.2rem,calc(430px_*_0.0425),1.4rem)] leading-[1.65] text-gray-800 font-normal ${inter.className}`}>
          {previewParas.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <button
          type="button"
          className={`group inline-flex items-baseline border-0 bg-transparent p-0 text-left text-[clamp(1.1rem,calc(430px_*_0.0385),1.25rem)] font-semibold text-[#1E343A] transition-colors hover:text-[#15282d] active:opacity-80 whitespace-nowrap ${inter.className}`}
          aria-label="Read more"
        >
          <span className="underline decoration-[#1E343A]/30 underline-offset-[0.35em] transition-[text-decoration-color] group-hover:decoration-[#15282d]/50">
            Read more →
          </span>
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  useLayoutEffect(() => {
    const measure = () => {
      const { width, height } = appViewportPx();
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

  /** Zoom from fixed reference width so canvas scale matches design across iPhone sizes (not per-device width). */
  const blogZoom = doeforvcRootZoom(BLOG_LAYOUT_WIDTH_PX);
  const applyBlogZoom = Math.abs(blogZoom - 1) > 0.001;

  const [first, ...rest] = MOBILE_NAV_FOOTER_SLIDES;

  return (
    <>
      {/* Nav must stay outside the zoomed root: `zoom` creates a containing block and breaks `position: fixed`. */}
      <DoeIphoneSiteNav />

      <div
        className="relative z-0 min-h-[100dvh] overflow-x-hidden doeforvc-iphone-root"
        style={{
          backgroundColor: "#F7F6F3",
          ...(applyBlogZoom ? { zoom: blogZoom } : {}),
        }}
        suppressHydrationWarning
      >
        <main
          className={`relative z-0 w-full max-w-[min(100%,430px)] mx-auto pt-[5.5rem] iphone-page:pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4rem))] pb-20 iphone-page:pb-24 ${narrowHorizontalInset}`}
        >
          {/* Inquisara at top: image first, then title / preview / Read more */}
          <div className="w-full mt-8 iphone-page:mt-10">
            <GradientArticleVisual slide={first} variant="hero" />
            <ArticleBlock slide={first} isFirst />
          </div>

          {rest.map((slide) => (
            <ArticleBlock key={slide.boxTitle} slide={slide} isFirst={false} />
          ))}
        </main>
      </div>
    </>
  );
}
