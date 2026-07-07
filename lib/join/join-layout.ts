import { DOEPHONE_PHONE_GUTTER_X } from "@/lib/doephone/section-styles";

/** Shared desktop content column — nav, main, and footer inner edges align here. */
export const JOIN_DESKTOP_CONTENT_MAX = "max-w-[1400px]";
export const JOIN_DESKTOP_CONTENT_PAD = "px-8";
export const JOIN_DESKTOP_CONTENT =
  `mx-auto w-full ${JOIN_DESKTOP_CONTENT_MAX} ${JOIN_DESKTOP_CONTENT_PAD}`;

/** Shared vertical/horizontal gutter for join iPhone sections — matches carousel inset. */
export const JOIN_MOBILE_SECTION_GUTTER = DOEPHONE_PHONE_GUTTER_X;

/** Clears pinchSafe nav strip — no extra band above hero. */
export const JOIN_MOBILE_NAV_CLEARANCE =
  "pt-[calc(env(safe-area-inset-top,0px)+clamp(4.25rem,3.5rem+2.5vmin,5.25rem))]";

/** Hero band — top gutter; gap before tracks comes from main flex gap below. */
export const JOIN_MOBILE_HERO_SECTION =
  `flex shrink-0 flex-col pt-[${JOIN_MOBILE_SECTION_GUTTER}]`;

/** Vertical stack gap — hero→Clinical and between track sections. */
export const JOIN_MOBILE_SECTION_STACK_GAP =
  `gap-11 iphone-page:gap-[${JOIN_MOBILE_SECTION_GUTTER}]`;

/** Hero card — first screen minus nav, top gutter, and hero→track gap. */
export const JOIN_MOBILE_HERO_CARD_HEIGHT =
  `h-[calc(var(--app-vh,100lvh)-env(safe-area-inset-top,0px)-clamp(4.25rem,3.5rem+2.5vmin,5.25rem)-3*${JOIN_MOBILE_SECTION_GUTTER})] min-h-0 w-full shrink-0`;

/** Half of join mobile hero height — intern track graphic boxes (taller on iPhone). */
export const JOIN_MOBILE_CARD_HEIGHT =
  "min-h-[calc(var(--app-vh,100lvh)*0.58)] h-[calc(var(--app-vh,100lvh)*0.58)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.56)] iphone-page:h-[calc(var(--app-vh,100lvh)*0.56)]";

/** Each intern track block on iPhone — nearly one full viewport tall. */
export const JOIN_MOBILE_TRACK_SECTION =
  "min-h-[calc(var(--app-vh,100lvh)*0.92)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.9)]";

/** Apply form band on iPhone — locked `--app-vh` (same stable unit as track sections). */
export const JOIN_MOBILE_APPLY_SECTION =
  "min-h-[var(--app-vh,100lvh)] iphone-page:min-h-[var(--app-vh,100lvh)]";

/** Bottom breathing room above join mobile footer. */
export const JOIN_MOBILE_APPLY_FOOTER_PAD =
  "pb-[max(3.5rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+3rem))]";

/** Anchor id for nav Apply buttons — scroll target for applicant card section. */
export const JOIN_APPLY_SECTION_ID = "join-apply";

export const JOIN_MOBILE_APPLY_SCROLL_MARGIN =
  "scroll-mt-[calc(env(safe-area-inset-top,0px)+clamp(4.25rem,3.5rem+2.5vmin,5.25rem))]";

export const JOIN_DESKTOP_APPLY_SCROLL_MARGIN = "scroll-mt-[5.5rem]";

/** Desktop hero — taller band for headline + clipped inbox preview. */
export const JOIN_DESKTOP_HERO_HEIGHT = "min-h-[min(88vh,56rem)] h-[min(88vh,56rem)]";

/** Extra top padding above desktop hero card (below nav). */
export const JOIN_DESKTOP_HERO_TOP_PAD = "pt-10";

/** Legacy stacked desktop track card height. */
export const JOIN_DESKTOP_CARD_HEIGHT = "min-h-[min(36vh,22rem)] h-[min(36vh,22rem)]";

/** Desktop intern track grid — 2×2 cards with larger boxes. */
export const JOIN_DESKTOP_TRACK_ROW_CARD_HEIGHT = "min-h-[28rem] h-[28rem]";
export const JOIN_DESKTOP_TRACK_ROW_GAP = "mt-14";
export const JOIN_DESKTOP_TRACK_ROW_COL_GAP = "gap-x-8 gap-y-16";

/** Desktop apply section — vertical band + footer pad. */
export const JOIN_DESKTOP_APPLY_SECTION_MIN =
  "min-h-[min(88vh,52rem)]";
export const JOIN_DESKTOP_APPLY_FOOTER_PAD = "pb-24";

/** Padding above “Build your applicant card.” on desktop. */
export const JOIN_DESKTOP_APPLY_TITLE_TOP_PAD = "pt-16";

/** Gap between apply title and card on desktop — half of doephone title→carousel gap. */
export const JOIN_DESKTOP_APPLY_TITLE_CARD_GAP = "mt-14";

/** Desktop applicant card — scaled from iPhone inline editor card. */
export const JOIN_DESKTOP_APPLY_CARD_HEIGHT = "h-[38rem]";

export const JOIN_DESKTOP_TRACK_GAP = "mt-14";
export const JOIN_DESKTOP_VIEWPORT_SPACER = "min-h-[100dvh] h-[100dvh]";
