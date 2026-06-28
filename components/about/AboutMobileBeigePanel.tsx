"use client";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { ABOUT_MOBILE_BEIGE_PANEL_TW } from "@/lib/about/about-layout-styles";

/** iPhone /about — full-width beige band with join-hero line graphic. */
export function AboutMobileBeigePanel({ graphic }: { graphic: 0 | 1 | 2 | 3 }) {
  return (
    <div className={ABOUT_MOBILE_BEIGE_PANEL_TW} aria-hidden>
      <JoinInternLineGraphic variant={graphic} brandAccent />
    </div>
  );
}
