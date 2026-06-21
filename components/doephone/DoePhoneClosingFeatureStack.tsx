"use client";

import { MOBILE_NAV_FOOTER_SLIDES } from "@/components/doe-nav-data";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW,
} from "@/lib/doephone/section-styles";

const CLOSING_FEATURE_SLIDES = MOBILE_NAV_FOOTER_SLIDES.slice(0, 3);

function ClosingFeatureCard({
  gradient,
  lineOverlay,
}: {
  gradient: string;
  lineOverlay: (typeof MOBILE_NAV_FOOTER_SLIDES)[number]["lineOverlay"];
}) {
  return (
    <div
      className={`relative overflow-hidden ${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
    >
      <div className="absolute inset-0" style={{ background: gradient }} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: lineOverlay.opacity,
          mixBlendMode: lineOverlay.mixBlendMode,
          backgroundImage: lineOverlay.backgroundImage,
          backgroundSize: lineOverlay.backgroundSize,
          backgroundPosition: lineOverlay.backgroundPosition,
        }}
        aria-hidden
      />
    </div>
  );
}

/** Three stacked feature cards with captions — no carousel. */
export function DoePhoneClosingFeatureStack() {
  return (
    <div className="flex flex-col" aria-label="Featured updates">
      {CLOSING_FEATURE_SLIDES.map((slide, index) => (
        <div
          key={slide.boxTitle}
          className={`space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]${
            index > 0 ? ` ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP}` : ""
          }`}
        >
          <ClosingFeatureCard gradient={slide.gradient} lineOverlay={slide.lineOverlay} />
          <p className={`text-left ${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW}`}>{slide.outside}</p>
        </div>
      ))}
    </div>
  );
}
