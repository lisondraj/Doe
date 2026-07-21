"use client";

import type { CSSProperties } from "react";

import { lora } from "@/lib/home/fonts";
import type { PitchSlideInstance } from "@/lib/pitch/pitch-slide-instance";
import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const THUMB_GRID_CELL = 14;
const THUMB_GRID_LINE = "rgba(255, 255, 255, 0.12)";

const heroThumbStyle: CSSProperties = {
  background: `linear-gradient(145deg, ${DOE_HOME_HERO_DUSK_PALETTE.horizon} 0%, ${DOE_HOME_HERO_DUSK_PALETTE.clay} 52%, ${DOE_HOME_HERO_DUSK_PALETTE.back} 100%)`,
};

const thumbLineGridStyle: CSSProperties = {
  backgroundImage: [
    `repeating-linear-gradient(0deg, transparent 0, transparent calc(${THUMB_GRID_CELL}px - 0.5px), ${THUMB_GRID_LINE} calc(${THUMB_GRID_CELL}px - 0.5px), ${THUMB_GRID_LINE} ${THUMB_GRID_CELL}px)`,
    `repeating-linear-gradient(90deg, transparent 0, transparent calc(${THUMB_GRID_CELL}px - 0.5px), ${THUMB_GRID_LINE} calc(${THUMB_GRID_CELL}px - 0.5px), ${THUMB_GRID_LINE} ${THUMB_GRID_CELL}px)`,
  ].join(", "),
  backgroundSize: `${THUMB_GRID_CELL}px ${THUMB_GRID_CELL}px`,
};

function slideFillStyle(slide: PitchSlideInstance): CSSProperties {
  if (slide.theme === "hero" || slide.theme === "active-agents-band") {
    return heroThumbStyle;
  }

  if (slide.theme === "panel") {
    return { background: slide.background ?? "#EDE8DF" };
  }

  return {
    background: slide.background,
    ...slide.backgroundStyle,
  };
}

export function PitchSlideThumbnail({ slide }: { slide: PitchSlideInstance }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={slideFillStyle(slide)}>
      {slide.lineGrid ? (
        <div className="pointer-events-none absolute inset-0" style={thumbLineGridStyle} aria-hidden />
      ) : null}
      {slide.slideId === "welcome" || slide.slideId === "closing" ? (
        <span
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
          style={{ fontSize: "clamp(0.7rem, 16%, 0.95rem)" }}
          aria-hidden
        >
          Doe
        </span>
      ) : null}
    </div>
  );
}
