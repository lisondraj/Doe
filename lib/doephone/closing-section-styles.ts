/** Closing section layout tokens — shared by phone and desktop CSS. */
export const CLOSING_SECTION_CAROUSEL_ARTICLE_COUNT = 5;

export const CLOSING_SECTION_DESKTOP_SLIDE_WIDTH = "clamp(36rem, 76vw, 62rem)";
export const CLOSING_SECTION_DESKTOP_SLIDE_HEIGHT = "clamp(22rem, 58vmin, 32rem)";

export const CLOSING_SECTION_PHONE_SLIDE_WIDTH = "calc(var(--app-vw, 100vw) * 0.88)";

/** iPhone — match feature-card carousel height so the closing band aligns with sections above. */
export const CLOSING_SECTION_PHONE_SLIDE_HEIGHT =
  "clamp(calc(23rem + var(--app-vh, 100lvh) / 8), calc(var(--app-vh, 100lvh) * 0.56), calc(40rem + var(--app-vh, 100lvh) / 8))";

export const CLOSING_SECTION_PHONE_SLIDE_MAX_HEIGHT = "calc(var(--app-vh, 100lvh) * 0.62)";

/** Legacy stacked cards — caption sits inside the box at bottom-left. */
export const DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT =
  "min-h-[clamp(22rem,58vmin,32rem)] h-[clamp(22rem,58vmin,32rem)] iphone-page:min-h-[clamp(20.5rem,54.5vmin,30rem)] iphone-page:h-[clamp(20.5rem,54.5vmin,30rem)]";
