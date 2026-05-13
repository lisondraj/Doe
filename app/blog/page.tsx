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
  "iphone-page:pl-[max(1rem,calc(env(safe-area-inset-left,0px)+0.5rem))] iphone-page:pr-[max(1rem,calc(env(safe-area-inset-right,0px)+0.5rem))]";

/** Preview blurbs aligned with each nav footer slide (outside text = post title). */
const SLIDE_PREVIEWS: Record<string, string> = {
  Inquisara:
    "How we assembled a clinical and product team around one question: what would actually help at the point of care? A short look at origin stories, trade-offs, and what “Inquisara” means for Doe.",
  "Doe Ecosystem":
    "Hospitals, education, and startups don’t have to compete for attention on the same dashboard. Here’s how we think about wiring the future of medicine—interoperably, patiently, and with clinicians in the loop.",
  "For Students":
    "From pre-clinical drill to residency handoff: tools that respect how students actually study, cram, and recover. No gimmicks—just structure, spaced prompts, and feedback you can trust before you touch a patient.",
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
  const preview = SLIDE_PREVIEWS[slide.boxTitle] ?? "";

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
        <p
          className={`text-[clamp(1.1rem,3.9vw,1.3rem)] iphone-page:text-[clamp(1.2rem,4.25vw,1.4rem)] leading-[1.65] text-gray-800 ${inter.className}`}
          style={{ fontWeight: 500 }}
        >
          {preview}
        </p>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-full bg-[#1E343A] px-10 py-4 iphone-page:px-12 iphone-page:py-[1.125rem] text-[clamp(1.05rem,3.5vw,1.2rem)] iphone-page:text-[clamp(1.1rem,3.75vw,1.25rem)] font-semibold text-white shadow-[0_8px_24px_rgba(30,52,58,0.25)] active:scale-[0.98] transition-transform ${inter.className}`}
        >
          Read more
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
