"use client";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { ABOUT_DESKTOP_BEIGE_PANEL_TW } from "@/lib/about/about-layout-styles";

/** Beige square with centered join-hero line graphic — matches iPhone closing band cards. */
export function AboutDesktopBeigePanel({ graphic }: { graphic: 0 | 1 | 2 | 3 }) {
  return (
    <div
      className={`relative overflow-hidden border border-[#D9D4CC] bg-[#EBE7E0] ${ABOUT_DESKTOP_BEIGE_PANEL_TW}`}
      aria-hidden
    >
      <JoinInternLineGraphic variant={graphic} brandAccent />
    </div>
  );
}
