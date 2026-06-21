"use client";

import { MOBILE_NAV_FOOTER_SLIDES } from "@/components/doe-nav-data";
import { NAV_FOOTER_OUTSIDE_TITLE_TW } from "@/lib/home/nav-footer-carousel-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { useRef, useState } from "react";

/** Nav-style gradient carousel — blank card, dots, outside caption only. */
export function DoePhoneSectionFooterCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div
      ref={scrollRef}
      className="flex w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
      onScroll={(e) => {
        const el = e.currentTarget;
        const w = el.clientWidth;
        if (w <= 0) return;
        setActiveSlide(
          Math.min(
            MOBILE_NAV_FOOTER_SLIDES.length - 1,
            Math.max(0, Math.round(el.scrollLeft / w)),
          ),
        );
      }}
      aria-label="Featured updates"
    >
      {MOBILE_NAV_FOOTER_SLIDES.map((slide, slideIndex) => (
        <div
          key={slide.boxTitle}
          className="box-border w-full min-w-full shrink-0 snap-center space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]"
        >
          <div
            className={`relative min-h-[clamp(16rem,44vmin,24rem)] overflow-hidden iphone-page:min-h-[clamp(15rem,42vmin,22.5rem)] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
          >
            <div className="absolute inset-0" style={{ background: slide.gradient }} aria-hidden />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: slide.lineOverlay.opacity,
                mixBlendMode: slide.lineOverlay.mixBlendMode,
                backgroundImage: slide.lineOverlay.backgroundImage,
                backgroundSize: slide.lineOverlay.backgroundSize,
                backgroundPosition: slide.lineOverlay.backgroundPosition,
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 top-0 z-[4] flex justify-center gap-2.5 px-5 pb-1 pt-8 iphone-page:gap-[clamp(0.65rem,0.45rem+1vmin,0.95rem)] iphone-page:pt-[clamp(1.65rem,1.25rem+1.65vmin,2.75rem)]">
              {MOBILE_NAV_FOOTER_SLIDES.map((s, dotIndex) => (
                <button
                  key={s.boxTitle}
                  type="button"
                  aria-label={`Show ${s.outside}`}
                  aria-current={activeSlide === dotIndex ? "true" : undefined}
                  className={`h-2.5 shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 iphone-page:h-[clamp(9px,calc(6px+0.45vmin),12px)] ${
                    activeSlide === dotIndex
                      ? "w-8 bg-white opacity-95 iphone-page:w-[clamp(1.95rem,calc(1.65rem+1.9vmin),2.85rem)]"
                      : "w-2.5 bg-white/45 hover:bg-white/70 iphone-page:w-[clamp(0.625rem,calc(0.5rem+0.42vmin),0.75rem)]"
                  }`}
                  onClick={() => {
                    const el = scrollRef.current;
                    if (!el) return;
                    el.scrollTo({ left: dotIndex * el.clientWidth, behavior: "smooth" });
                    setActiveSlide(dotIndex);
                  }}
                />
              ))}
            </div>
          </div>

          <p
            className={`text-left ${NAV_FOOTER_OUTSIDE_TITLE_TW}`}
            aria-live={activeSlide === slideIndex ? "polite" : undefined}
          >
            {slide.outside}
          </p>
        </div>
      ))}
    </div>
  );
}
