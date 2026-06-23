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
      className="grid w-full grid-cols-3 grid-rows-2 gap-[clamp(0.58rem,0.45rem+0.65vmin,0.88rem)] iphone-page:gap-[clamp(0.65rem,0.5rem+0.72vmin,0.95rem)]"
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
            className={`relative flex min-h-[clamp(5.15rem,4.35rem+3.35vmin,6.85rem)] flex-col items-center justify-center overflow-hidden rounded-[clamp(0.42rem,0.35rem+0.28vmin,0.55rem)] px-[clamp(0.38rem,0.28rem+0.42vmin,0.55rem)] py-[clamp(0.62rem,0.5rem+0.48vmin,0.82rem)] pb-[clamp(0.88rem,0.72rem+0.62vmin,1.12rem)] text-center transition-[background-color,color] duration-200 ${suisseIntl.className} font-[420] tracking-[-0.02em] ${
              active
                ? "bg-[#E3E1DB] text-[#1E343A]"
                : "bg-[#1E343A]/[0.06] text-[#1E343A]/35"
            }`}
            onClick={() => onSelect(index)}
          >
            <span className="flex flex-col items-center justify-center gap-[0.08em] leading-[1.08] text-[clamp(1.34rem,1.15rem+0.92vmin,1.68rem)] iphone-page:text-[clamp(1.42rem,1.22rem+1vmin,1.78rem)]">
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
