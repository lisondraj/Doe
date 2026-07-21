import type { CSSProperties } from "react";

import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

export type PitchSlideId =
  | "welcome"
  | "problem"
  | "solution"
  | "product-voice"
  | "product-roadmap"
  | "product-blank"
  | "team"
  | "market"
  | "ask"
  | "closing";

export type PitchSlideTheme =
  | "hero"
  | "dark"
  | "panel"
  | "gradient"
  | "brown"
  | "active-agents-band";

export type PitchSlideDefinition = {
  slideId: PitchSlideId;
  label: string;
  theme: PitchSlideTheme;
  /** Slide index color in preview — light fills need dark numerals. */
  numberTone?: "light" | "dark";
  background?: string;
  backgroundStyle?: CSSProperties;
  lineGrid?: boolean;
};

/** @deprecated Use PitchSlideDefinition for templates or PitchSlideInstance at runtime. */
export type PitchSlide = PitchSlideDefinition;

export const PITCH_SLIDES: readonly PitchSlideDefinition[] = [
  { slideId: "welcome", label: "Welcome", theme: "hero" },
  {
    slideId: "problem",
    label: "Problem",
    theme: "panel",
    background: "#EBE5DA",
    numberTone: "dark",
  },
  {
    slideId: "solution",
    label: "Solution",
    theme: "active-agents-band",
  },
  {
    slideId: "product-voice",
    label: "Product 1",
    theme: "panel",
    background: "#EDE8DF",
    numberTone: "dark",
  },
  {
    slideId: "product-roadmap",
    label: "Product 2",
    theme: "gradient",
    backgroundStyle: {
      background: "linear-gradient(168deg, #5c4330 0%, #3d2e1f 42%, #1a1208 100%)",
    },
  },
  {
    slideId: "product-blank",
    label: "Product 3",
    theme: "panel",
    background: "#EDE8DF",
    numberTone: "dark",
  },
  {
    slideId: "team",
    label: "Team",
    theme: "panel",
    background: "#EBE5DA",
    numberTone: "dark",
  },
  {
    slideId: "market",
    label: "Market",
    theme: "dark",
    background: DOE_HOME_HERO_DUSK_PALETTE.back,
  },
  {
    slideId: "ask",
    label: "The ask",
    theme: "brown",
    background: "#241910",
  },
  {
    slideId: "closing",
    label: "Thank you",
    theme: "hero",
  },
] as const;

export const PITCH_SLIDE_COUNT = PITCH_SLIDES.length;
