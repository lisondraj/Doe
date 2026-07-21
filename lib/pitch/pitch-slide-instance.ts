import type { CSSProperties } from "react";

import type { PitchSlideId, PitchSlideTheme } from "@/lib/pitch/pitch-slides";

export type PitchSlideInstance = {
  instanceId: string;
  slideId: PitchSlideId;
  label: string;
  theme: PitchSlideTheme;
  numberTone?: "light" | "dark";
  background?: string;
  backgroundStyle?: CSSProperties;
  lineGrid?: boolean;
};

let instanceCounter = 0;

export function createPitchSlideInstance(
  slide: Omit<PitchSlideInstance, "instanceId">,
): PitchSlideInstance {
  instanceCounter += 1;
  return {
    ...slide,
    instanceId: `pitch-${instanceCounter}`,
    backgroundStyle: slide.backgroundStyle ? { ...slide.backgroundStyle } : undefined,
  };
}

export function duplicatePitchSlideInstance(slide: PitchSlideInstance): PitchSlideInstance {
  instanceCounter += 1;
  const label = slide.label.replace(/ \(copy\)$/, "");

  return {
    ...slide,
    instanceId: `pitch-${instanceCounter}`,
    label: `${label} (copy)`,
    backgroundStyle: slide.backgroundStyle ? { ...slide.backgroundStyle } : undefined,
  };
}

export function insertDuplicateSlide(
  slides: PitchSlideInstance[],
  index: number,
): { slides: PitchSlideInstance[]; nextActiveIndex: number } {
  const source = slides[index];

  if (!source) {
    return { slides, nextActiveIndex: index };
  }

  const copy = duplicatePitchSlideInstance(source);
  const next = [...slides];
  next.splice(index + 1, 0, copy);

  return { slides: next, nextActiveIndex: index + 1 };
}
