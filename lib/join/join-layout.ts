/** Shared desktop content column — nav, main, and footer inner edges align here. */
export const JOIN_DESKTOP_CONTENT_MAX = "max-w-[1400px]";
export const JOIN_DESKTOP_CONTENT_PAD = "px-8";
export const JOIN_DESKTOP_CONTENT =
  `mx-auto w-full ${JOIN_DESKTOP_CONTENT_MAX} ${JOIN_DESKTOP_CONTENT_PAD}`;

/** Shared vertical/horizontal gutter for join iPhone sections — matches carousel inset. */
export const JOIN_MOBILE_SECTION_GUTTER =
  "max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))";

/** Clears pinchSafe nav strip — no extra band above hero. */
export const JOIN_MOBILE_NAV_CLEARANCE =
  "pt-[calc(env(safe-area-inset-top,0px)+clamp(4.25rem,3.5rem+2.5vmin,5.25rem))]";

/** Hero band — top gutter only; gap before tracks is a spacer sibling below. */
export const JOIN_MOBILE_HERO_SECTION =
  "flex flex-col pt-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Vertical stack gap between intern track sections. */
export const JOIN_MOBILE_SECTION_STACK_GAP =
  "gap-14 iphone-page:gap-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Beige band between hero and first track — matches inter-track gap. */
export const JOIN_MOBILE_HERO_TO_TRACK_SPACER =
  "min-h-14 shrink-0 iphone-page:min-h-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Hero card — proportional height so the track spacer stays visible on screen. */
export const JOIN_MOBILE_HERO_CARD_HEIGHT =
  "h-[calc(var(--app-vh,100lvh)*0.52)] min-h-0 w-full shrink-0 iphone-page:h-[calc(var(--app-vh,100lvh)*0.5)] iphone-page:min-h-0";

/** Half of join mobile hero height — intern track graphic boxes (taller on iPhone). */
export const JOIN_MOBILE_CARD_HEIGHT =
  "min-h-[calc(var(--app-vh,100lvh)*0.58)] h-[calc(var(--app-vh,100lvh)*0.58)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.56)] iphone-page:h-[calc(var(--app-vh,100lvh)*0.56)]";

/** Each intern track block on iPhone — nearly one full viewport tall. */
export const JOIN_MOBILE_TRACK_SECTION =
  "min-h-[calc(var(--app-vh,100lvh)*0.92)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.9)]";

/** Apply form band on iPhone — one locked viewport tall. */
export const JOIN_MOBILE_APPLY_SECTION =
  "box-border h-[var(--app-vh,100lvh)] min-h-[var(--app-vh,100lvh)]";

/** Safe-area-only padding so justify-center fills the full viewport height. */
export const JOIN_MOBILE_APPLY_SECTION_PAD =
  "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]";

/** Gap between apply section title and applicant card. */
export const JOIN_MOBILE_APPLY_TITLE_CARD_GAP =
  "mt-8 iphone-page:mt-[max(2rem,calc(env(safe-area-inset-left,0px)+4.25vmin))]";

/** Desktop hero — same proportions as mobile, capped for wide screens. */
export const JOIN_DESKTOP_HERO_HEIGHT = "min-h-[min(72vh,44rem)] h-[min(72vh,44rem)]";

/** Extra top padding above desktop hero card (below nav). */
export const JOIN_DESKTOP_HERO_TOP_PAD = "pt-10";

/** Legacy stacked desktop track card height. */
export const JOIN_DESKTOP_CARD_HEIGHT = "min-h-[min(36vh,22rem)] h-[min(36vh,22rem)]";

/** Desktop intern track row — four compact cards in one line. */
export const JOIN_DESKTOP_TRACK_ROW_CARD_HEIGHT = "min-h-[13.5rem] h-[13.5rem]";
export const JOIN_DESKTOP_TRACK_ROW_GAP = "mt-12";
export const JOIN_DESKTOP_TRACK_ROW_COL_GAP = "gap-5";

/** Desktop apply section — vertical band + footer pad. */
export const JOIN_DESKTOP_APPLY_SECTION_MIN =
  "min-h-[min(88vh,52rem)]";
export const JOIN_DESKTOP_APPLY_FOOTER_PAD = "pb-24";

/** Padding above “Build your applicant card.” on desktop. */
export const JOIN_DESKTOP_APPLY_TITLE_TOP_PAD = "pt-16";

/** Desktop applicant card — scaled from iPhone inline editor card. */
export const JOIN_DESKTOP_APPLY_CARD_HEIGHT = "h-[38rem]";

export const JOIN_DESKTOP_TRACK_GAP = "mt-14";
export const JOIN_DESKTOP_VIEWPORT_SPACER = "min-h-[100dvh] h-[100dvh]";
