"use client";

import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
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
            className={`relative flex min-h-[clamp(3.85rem,3.25rem+2.65vmin,5rem)] flex-col items-center justify-center rounded-[clamp(0.35rem,0.3rem+0.22vmin,0.45rem)] px-[clamp(0.22rem,0.16rem+0.28vmin,0.38rem)] py-[clamp(0.42rem,0.34rem+0.38vmin,0.58rem)] pb-[clamp(0.62rem,0.5rem+0.48vmin,0.82rem)] text-center transition-[background-color,color] duration-200 ${suisseIntl.className} font-light tracking-[-0.02em] ${
              active
                ? "bg-[#E3E1DB] text-[#1E343A]"
                : "bg-[#1E343A]/[0.06] text-[#1E343A]/35"
            }`}
            onClick={() => onSelect(index)}
          >
            <span className="flex flex-col items-center justify-center gap-[0.08em] leading-[1.08] text-[clamp(0.95rem,0.84rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.02rem,0.9rem+0.62vmin,1.2rem)]">
              <span>{lines[0]}</span>
              {lines[1] ? <span>{lines[1]}</span> : null}
            </span>
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-x-[12%] bottom-[clamp(0.34rem,0.28rem+0.32vmin,0.46rem)] h-px bg-[#1E343A] transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
