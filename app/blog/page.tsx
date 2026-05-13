"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import {
  MOBILE_NAV_FOOTER_SLIDES,
  MobileNavFooterShapeIcon,
} from "@/components/doe-nav-data";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  "iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))]";

export default function BlogPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [featuredSlide, setFeaturedSlide] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = featuredRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const len = MOBILE_NAV_FOOTER_SLIDES.length;
      const i = Math.min(len - 1, Math.max(0, Math.round(el.scrollLeft / w)));
      const next = (i + 1) % len;
      el.scrollTo({ left: next * w, behavior: "smooth" });
      setFeaturedSlide(next);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const rootZoom = doeforvcRootZoom(viewportWidth);
  const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;

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
        className={`relative z-10 pt-[5.75rem] iphone-page:pt-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.25rem))] pb-16 iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))] ${narrowHorizontalInset}`}
      >
        <article className="mx-auto max-w-[min(100%,36rem)]">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 ${inter.className}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Home
            </Link>

            <p className={`text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 mb-4 ${inter.className}`}>
              Field notes
            </p>
            <h1
              className={`text-[clamp(1.85rem,5.85vw,2.55rem)] text-gray-900 tracking-tight leading-[1.15] mb-4 ${lora.className}`}
            >
              Designing Doe for the bedside, not the spreadsheet.
            </h1>
            <p className={`text-sm text-gray-500 mb-10 ${inter.className}`}>May 13, 2026 · 6 min read</p>

            <div
              className={`space-y-5 text-[0.9375rem] leading-[1.65] text-gray-800 ${inter.className}`}
              style={{ fontWeight: 500 }}
            >
              <p>
                When we talk about AI in medicine, the demo that wins is rarely the workflow that ships. Clinical teams
                want signal in context: who changed, what broke, and what to do next—without re-learning a new chrome
                every morning.
              </p>
              <p>
                Doe is built as an ambient layer: it summarizes the inbox, stacks imaging and labs for review, and drafts
                payer packets so your day returns to patients. The product mockups you see on our home page mirror how we
                think about density—bold cards, clear hierarchy, and typography that stays legible on the smallest phones.
              </p>
              <p>
                This is an editorial prototype: one post, one column, and the same beige canvas as the marketing site so
                the story feels continuous when you open it from Safari on an iPhone. Below are the three featured stories
                from our navigation—they use the same gradient capsules you see when the menu is expanded.
              </p>
            </div>
        </article>

        <section className="mx-auto max-w-[min(100%,36rem)] mt-16 pt-12 border-t border-[#E6E6E6]">
          <h2
            className={`text-center text-[1.0625rem] font-semibold tracking-tight text-gray-900 mb-8 ${inter.className}`}
          >
            Essential reading
          </h2>
          <div
            ref={featuredRef}
            className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const w = el.clientWidth;
              if (w <= 0) return;
              setFeaturedSlide(
                Math.min(
                  MOBILE_NAV_FOOTER_SLIDES.length - 1,
                  Math.max(0, Math.round(el.scrollLeft / w))
                )
              );
            }}
            aria-label="Featured stories"
          >
            {MOBILE_NAV_FOOTER_SLIDES.map((slide) => (
              <div
                key={slide.boxTitle}
                className="w-full min-w-full shrink-0 snap-center space-y-3 box-border px-1"
              >
                <div className="relative rounded-[1.375rem] iphone-page:rounded-[clamp(1.2rem,1rem+1.4vmin,2.1rem)] overflow-hidden min-h-[22rem] iphone-page:min-h-[clamp(18rem,52vmin,36rem)] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
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
                  <div className="absolute left-0 right-0 top-0 z-[4] flex justify-center gap-2.5 iphone-page:gap-[clamp(0.65rem,0.45rem+1vmin,0.95rem)] px-5 pt-8 iphone-page:pt-[clamp(1.5rem,1.2rem+1.5vmin,2.75rem)] pb-1">
                    {MOBILE_NAV_FOOTER_SLIDES.map((s, dotI) => (
                      <button
                        key={s.boxTitle}
                        type="button"
                        aria-label={`Show ${s.boxTitle}`}
                        aria-current={featuredSlide === dotI ? "true" : undefined}
                        className={`h-2.5 iphone-page:h-[clamp(9px,calc(6px+0.45vmin),12px)] shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 shadow-sm ${
                          featuredSlide === dotI
                            ? "w-8 iphone-page:w-[clamp(1.95rem,calc(1.65rem+1.9vmin),2.85rem)] bg-white opacity-95"
                            : "w-2.5 iphone-page:w-[clamp(0.625rem,calc(0.5rem+0.42vmin),0.75rem)] bg-white/45 hover:bg-white/70"
                        }`}
                        onClick={() => {
                          const el = featuredRef.current;
                          if (!el) return;
                          const step = el.clientWidth;
                          el.scrollTo({ left: dotI * step, behavior: "smooth" });
                          setFeaturedSlide(dotI);
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-6 iphone-page:p-[clamp(1.25rem,0.85rem+2.5vmin,2.75rem)]">
                    <div className={`flex items-center gap-6 iphone-page:gap-[clamp(1.25rem,1rem+2.75vmin,2.5rem)] text-white ${inter.className}`}>
                      <MobileNavFooterShapeIcon shape={slide.shape} />
                      <span className="text-[2.5rem] iphone-page:text-[clamp(1.85rem,0.95rem+4.5vmin,3.75rem)] font-medium tracking-tight leading-none">
                        {slide.boxTitle}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Link
                    href="/#build"
                    className={`flex w-full flex-row flex-wrap items-center justify-start gap-2.5 iphone-page:gap-[clamp(0.85rem,0.55rem+1.2vmin,1rem)] text-left active:opacity-80 transition-opacity ${inter.className}`}
                  >
                    <span className="text-[1.35rem] iphone-page:text-[clamp(1.22rem,0.78rem+2vmin,2.25rem)] font-medium text-gray-800 tracking-tight leading-snug">
                      {slide.outside}
                    </span>
                    <span
                      className="shrink-0 inline-flex h-12 w-12 iphone-page:h-[clamp(2.65rem,10vmin,4.25rem)] iphone-page:w-[clamp(2.65rem,10vmin,4.25rem)] items-center justify-center rounded-full border-2 border-gray-300/90 bg-white text-gray-900 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                      aria-hidden
                    >
                      <svg
                        className="w-6 h-6 iphone-page:w-[clamp(1.25rem,4.85vmin,2.1rem)] iphone-page:h-[clamp(1.25rem,4.85vmin,2.1rem)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </Link>
                  <p
                    className={`mt-1.5 text-[0.98rem] iphone-page:text-[clamp(0.9rem,0.72rem+1.05vmin,1.35rem)] font-medium tracking-tight text-gray-500 ${inter.className}`}
                  >
                    {slide.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
