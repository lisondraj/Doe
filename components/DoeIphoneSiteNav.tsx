"use client";

import Link from "next/link";
import { Inter, Lora } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  dropdownContent,
  MOBILE_NAV_FOOTER_SLIDES,
  MobileNavFooterShapeIcon,
  NAV_ITEMS,
} from "@/components/doe-nav-data";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function NavChromeStrip({
  navTextColor,
  mobileNavOpen,
  toggleMenu,
}: {
  navTextColor: string;
  mobileNavOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    // All sizes pinned to 430px-viewport reference (1vmin≈4.3px, 1rem=16px) so chrome is
    // identical on every iPhone size regardless of actual device viewport width.
    <div className="px-8 py-6 iphone-page:py-[0.9375rem] iphone-page:pl-[max(1.25rem,calc(env(safe-area-inset-left,0px)+0.75rem))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] flex items-center relative z-10 iphone-page:gap-[0.6rem] justify-end">
      <Link
        href="/"
        className={`absolute top-1/2 -translate-y-1/2 left-8 iphone-page:left-[max(1.25rem,calc(env(safe-area-inset-left,0px)+0.75rem))] font-normal z-[1] min-w-0 whitespace-nowrap transition-opacity duration-500 ease-out ${lora.className} text-4xl iphone-page:text-[2rem] iphone-page:leading-none opacity-100`}
        style={{ color: navTextColor }}
      >
        Doe
      </Link>

      <div className="hidden items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_ITEMS.map((item) => (
          <span key={item} className="text-sm">
            {item}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="flex items-center justify-center p-3 iphone-page:p-[0.75rem] rounded-xl transition-colors active:bg-black/[0.04]"
        style={{ color: navTextColor }}
        aria-expanded={mobileNavOpen}
        aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={toggleMenu}
      >
        {mobileNavOpen ? (
          <svg
            className="w-9 h-9 iphone-page:w-[1.9rem] iphone-page:h-[1.9rem]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-9 h-9 iphone-page:w-[1.9rem] iphone-page:h-[1.9rem]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>
    </div>
  );
}

/**
 * Fixed Doe wordmark + hamburger, with the same full-screen iPhone nav sheet and
 * three-card featured carousel as the home page — solid beige chrome for subpages.
 */
export default function DoeIphoneSiteNav() {
  const isPhoneLayout = true;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileNavExpandedKey, setMobileNavExpandedKey] = useState<string | null>(null);
  const [mobileNavFooterSlide, setMobileNavFooterSlide] = useState(0);
  const mobileNavFooterCarouselRef = useRef<HTMLDivElement>(null);
  const navBarRowRef = useRef<HTMLDivElement>(null);
  const [iphoneMenuTopPx, setIphoneMenuTopPx] = useState(88);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useLayoutEffect(() => {
    const navEl = navBarRowRef.current;
    if (!navEl) return;
    const update = () => {
      const raw = navEl.getBoundingClientRect().bottom;
      setIphoneMenuTopPx(Math.max(0, Math.floor(raw) - 6));
    };
    update();
    let raf1 = 0;
    let raf2 = 0;
    if (mobileNavOpen) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(update);
      });
    }
    const ro = new ResizeObserver(update);
    ro.observe(navEl);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [mobileNavOpen, viewportWidth]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) setMobileNavExpandedKey(null);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) setMobileNavFooterSlide(0);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const id = window.setInterval(() => {
      const el = mobileNavFooterCarouselRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const len = MOBILE_NAV_FOOTER_SLIDES.length;
      const i = Math.min(len - 1, Math.max(0, Math.round(el.scrollLeft / w)));
      const next = (i + 1) % len;
      el.scrollTo({ left: next * w, behavior: "smooth" });
      setMobileNavFooterSlide(next);
    }, 4000);
    return () => window.clearInterval(id);
  }, [mobileNavOpen]);

  const navTextColor = "#000";

  const mobileMenuLayer =
    mounted &&
    isPhoneLayout &&
    mobileNavOpen &&
    createPortal(
      <>
        <button
          type="button"
          className="fixed inset-0 z-[90] cursor-pointer bg-black/25 transition-opacity duration-300 ease-out"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
        <div className="fixed inset-0 z-[95] pointer-events-none" role="presentation">
          <div
            className="absolute inset-x-0 top-0 bg-[#F7F6F3] pointer-events-none"
            style={{ height: iphoneMenuTopPx }}
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 bg-[#F7F6F3] flex flex-col pointer-events-auto overflow-hidden min-h-0"
            style={{ top: iphoneMenuTopPx }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {NAV_ITEMS.map((item) => {
                const expanded = mobileNavExpandedKey === item;
                const subs = dropdownContent[item]?.items ?? [];
                const four = subs.slice(0, 4);
                return (
                  <div key={item} className="border-b border-[#E6E6E6]">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      className={`flex w-full items-center gap-2.5 iphone-page:gap-[0.6rem] text-left font-medium tracking-[-0.02em] text-gray-900 pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+1.4rem))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] py-4 iphone-page:py-[0.8rem] active:bg-black/[0.04] transition-colors ${inter.className} text-4xl iphone-page:text-[1.6rem] iphone-page:leading-none`}
                      onClick={() => setMobileNavExpandedKey((k) => (k === item ? null : item))}
                    >
                      <span className="min-w-0">{item}</span>
                      <span className="shrink-0 inline-flex items-center justify-center text-gray-400 self-center" aria-hidden>
                        {expanded ? (
                          <svg
                            className="w-[1.5rem] h-[1.5rem] transition-transform duration-200 ease-out"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        ) : (
                          <svg
                            className="w-[1.5rem] h-[1.5rem] transition-transform duration-200 ease-out"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        )}
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden min-h-0">
                        {four.length > 0 && (
                          <div className="flex flex-col pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+1.4rem))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] pb-3 pt-0">
                            {four.map((sub) =>
                              sub.href ? (
                                <Link
                                  key={sub.title}
                                  href={sub.href}
                                  className={`block w-full text-left py-3.5 iphone-page:py-[0.75rem] pl-7 iphone-page:pl-[2.5rem] text-[1.625rem] iphone-page:text-[1.25rem] leading-snug font-medium text-gray-600 active:bg-black/[0.03] transition-colors ${inter.className}`}
                                  onClick={() => setMobileNavOpen(false)}
                                >
                                  {sub.title}
                                </Link>
                              ) : (
                                <button
                                  key={sub.title}
                                  type="button"
                                  className={`w-full text-left py-3.5 iphone-page:py-[0.75rem] pl-7 iphone-page:pl-[2.5rem] text-[1.625rem] iphone-page:text-[1.25rem] leading-snug font-medium text-gray-600 active:bg-black/[0.03] transition-colors ${inter.className}`}
                                  onClick={() => setMobileNavOpen(false)}
                                >
                                  {sub.title}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className="shrink-0 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+10px))] iphone-page:pb-[max(0.9375rem,calc(env(safe-area-inset-bottom,0px)+10px))] pt-4 iphone-page:pt-[0.8rem] border-t border-[#ECEAE6]">
              <div
                ref={mobileNavFooterCarouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const w = el.clientWidth;
                  if (w <= 0) return;
                  setMobileNavFooterSlide(
                    Math.min(
                      MOBILE_NAV_FOOTER_SLIDES.length - 1,
                      Math.max(0, Math.round(el.scrollLeft / w))
                    )
                  );
                }}
                aria-label="Featured"
              >
                {MOBILE_NAV_FOOTER_SLIDES.map((slide) => (
                  <div
                    key={slide.boxTitle}
                    className="w-full min-w-full shrink-0 snap-center px-6 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+1.15rem))] iphone-page:pr-[max(1.35rem,calc(env(safe-area-inset-right,0px)+0.85rem))] space-y-3 box-border iphone-page:space-y-[0.65rem]"
                  >
                    <div className="relative rounded-[1.375rem] iphone-page:rounded-[1.375rem] overflow-hidden min-h-[30rem] iphone-page:min-h-[22rem] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
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
                      <div className="absolute left-0 right-0 top-0 z-[4] flex justify-center gap-2.5 iphone-page:gap-[0.75rem] px-5 pt-10 iphone-page:pt-[2.1rem] pb-1">
                        {MOBILE_NAV_FOOTER_SLIDES.map((s, dotI) => (
                          <button
                            key={s.boxTitle}
                            type="button"
                            aria-label={`Show ${s.boxTitle}`}
                            aria-current={mobileNavFooterSlide === dotI ? "true" : undefined}
                            className={`h-2.5 iphone-page:h-[9px] shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 shadow-sm ${
                              mobileNavFooterSlide === dotI
                                ? "w-8 iphone-page:w-[2.15rem] bg-white opacity-95"
                                : "w-2.5 iphone-page:w-[0.625rem] bg-white/45 hover:bg-white/70"
                            }`}
                            onClick={() => {
                              const el = mobileNavFooterCarouselRef.current;
                              if (!el) return;
                              const step = el.clientWidth;
                              el.scrollTo({ left: dotI * step, behavior: "smooth" });
                              setMobileNavFooterSlide(dotI);
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-8 iphone-page:p-[1.75rem]">
                        <div
                          className={`flex items-center gap-7 iphone-page:gap-[2rem] text-white ${inter.className}`}
                        >
                          <MobileNavFooterShapeIcon shape={slide.shape} />
                          <span className="text-[3.25rem] iphone-page:text-[2.5rem] font-medium tracking-tight leading-none">
                            {slide.boxTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link
                        href="/#build"
                        className={`flex w-full flex-row flex-wrap items-center justify-start gap-2.5 iphone-page:gap-[0.875rem] text-left active:opacity-80 transition-opacity ${inter.className}`}
                        onClick={() => setMobileNavOpen(false)}
                        aria-label={slide.outside}
                      >
                        <span className="text-[1.5rem] iphone-page:text-[1.5rem] font-medium text-gray-800 tracking-tight leading-snug">
                          {slide.outside}
                        </span>
                        <span
                          className="shrink-0 inline-flex h-14 w-14 iphone-page:h-[3.1rem] iphone-page:w-[3.1rem] items-center justify-center rounded-full border-2 border-gray-300/90 bg-white text-gray-900 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                          aria-hidden
                        >
                          <svg
                            className="w-7 h-7 iphone-page:w-[1.4rem] iphone-page:h-[1.4rem]"
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
                        className={`mt-1.5 text-[1.0625rem] iphone-page:text-[1.1rem] font-medium tracking-tight text-gray-500 ${inter.className}`}
                      >
                        {slide.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    );

  const navChromeElevated =
    mounted &&
    mobileNavOpen &&
    createPortal(
      <header
        className="fixed top-0 left-0 right-0 z-[200] iphone-page:pt-[env(safe-area-inset-top,0px)] bg-[#F7F6F3] border-b border-[#E6E6E6]"
        style={{
          transition: "border-bottom 100ms ease-out, border-color 100ms ease-out, background-color 180ms ease-out",
        }}
      >
        <NavChromeStrip
          navTextColor={navTextColor}
          mobileNavOpen={mobileNavOpen}
          toggleMenu={() => setMobileNavOpen((o) => !o)}
        />
      </header>,
      document.body
    );

  return (
    <>
      <nav
        ref={navBarRowRef}
        className={`fixed top-0 left-0 right-0 iphone-page:pt-[env(safe-area-inset-top,0px)] ${mobileNavOpen ? "z-[100]" : "z-50"}`}
        style={{
          backgroundColor: "#F7F6F3",
          borderBottom: "1px solid #E6E6E6",
          transition: "border-bottom 100ms ease-out, border-color 100ms ease-out, background-color 180ms ease-out",
        }}
      >
        <div
          className={mobileNavOpen ? "opacity-0 pointer-events-none select-none" : undefined}
          aria-hidden={mobileNavOpen ? true : undefined}
        >
          <NavChromeStrip
            navTextColor={navTextColor}
            mobileNavOpen={mobileNavOpen}
            toggleMenu={() => setMobileNavOpen((o) => !o)}
          />
        </div>
      </nav>
      {mobileMenuLayer}
      {navChromeElevated}
    </>
  );
}
