"use client";

import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOE_BRAND_GRADIENT_LINE } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";

function menuLabelLines(label: string): [string] | [string, string] {
  const space = label.indexOf(" ");
  if (space === -1) return [label];
  return [label.slice(0, space), label.slice(space + 1)];
}

export function DoePhoneCarouselMenu({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="grid w-full grid-cols-4 grid-rows-2 gap-[clamp(0.45rem,0.35rem+0.55vmin,0.68rem)] iphone-page:gap-[clamp(0.5rem,0.38rem+0.62vmin,0.75rem)]"
      role="tablist"
      aria-label="Communication feature slides"
    >
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide, index) => {
        const active = index === activeIndex;
        const lines = menuLabelLines(slide.menuLabel);

        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`doephone-comm-slide-${slide.id}`}
            className={`relative flex min-h-[clamp(4.55rem,3.85rem+2.95vmin,5.95rem)] flex-col items-center justify-center overflow-hidden rounded-[clamp(0.35rem,0.3rem+0.22vmin,0.45rem)] px-[clamp(0.28rem,0.2rem+0.35vmin,0.42rem)] py-[clamp(0.5rem,0.4rem+0.42vmin,0.68rem)] pb-[clamp(0.78rem,0.62rem+0.58vmin,1rem)] text-center transition-[background-color,color] duration-200 ${suisseIntl.className} font-medium tracking-[-0.02em] ${
              active
                ? "bg-[#E3E1DB] text-[#1E343A]"
                : "bg-[#1E343A]/[0.06] text-[#1E343A]/35"
            }`}
            onClick={() => onSelect(index)}
          >
            <span className="flex flex-col items-center justify-center gap-[0.1em] leading-[1.1] text-[clamp(1.22rem,1.05rem+0.78vmin,1.48rem)] iphone-page:text-[clamp(1.28rem,1.1rem+0.85vmin,1.56rem)]">
              <span>{lines[0]}</span>
              {lines[1] ? <span>{lines[1]}</span> : null}
            </span>
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0"
              }`}
              style={{ background: DOE_BRAND_GRADIENT_LINE }}
            />
          </button>
        );
      })}
    </div>
  );
}
