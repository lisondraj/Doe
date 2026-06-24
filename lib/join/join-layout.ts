/** Shared desktop content column — nav, main, and footer inner edges align here. */
export const JOIN_DESKTOP_CONTENT_MAX = "max-w-[1400px]";
export const JOIN_DESKTOP_CONTENT_PAD = "px-8";
export const JOIN_DESKTOP_CONTENT =
  `mx-auto w-full ${JOIN_DESKTOP_CONTENT_MAX} ${JOIN_DESKTOP_CONTENT_PAD}`;

/** Shared vertical/horizontal gutter for join iPhone sections — matches carousel inset. */
export const JOIN_MOBILE_SECTION_GUTTER =
  "max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))";

/** Top inset above join mobile hero card — tight under nav. */
export const JOIN_MOBILE_HERO_TOP_PAD =
  "pt-5 iphone-page:pt-[max(1rem,calc(env(safe-area-inset-left,0px)+2.15vmin))]";

/** Hero viewport section — top gutter only; bottom gap comes from first track margin. */
export const JOIN_MOBILE_HERO_INSET = JOIN_MOBILE_HERO_TOP_PAD;

/** First iPhone screen — hero fills viewport below nav. */
export const JOIN_MOBILE_HERO_VIEWPORT_SECTION =
  `flex flex-col iphone-page:min-h-[calc(var(--app-vh,100lvh)-max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem)))] ${JOIN_MOBILE_HERO_INSET}`;

/** Hero card fills remaining space inside the viewport section. */
export const JOIN_MOBILE_HERO_FILL = "h-full min-h-0 w-full flex-1";

/** Join mobile hero — tall band matching Agents carousel card styling (non-fill fallback). */
export const JOIN_MOBILE_HERO_HEIGHT =
  "min-h-[clamp(52rem,calc(var(--app-vh,100lvh)*1.12),76rem)] h-[clamp(52rem,calc(var(--app-vh,100lvh)*1.12),76rem)] iphone-page:min-h-[clamp(50rem,calc(var(--app-vh,100lvh)*1.08),72rem)] iphone-page:h-[clamp(50rem,calc(var(--app-vh,100lvh)*1.08),72rem)]";

/** Half of join mobile hero height — intern track graphic boxes (taller on iPhone). */
export const JOIN_MOBILE_CARD_HEIGHT =
  "min-h-[calc(var(--app-vh,100lvh)*0.58)] h-[calc(var(--app-vh,100lvh)*0.58)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.56)] iphone-page:h-[calc(var(--app-vh,100lvh)*0.56)]";

/** Each intern track block on iPhone — nearly one full viewport tall. */
export const JOIN_MOBILE_TRACK_SECTION =
  "min-h-[calc(var(--app-vh,100lvh)*0.92)] iphone-page:min-h-[calc(var(--app-vh,100lvh)*0.9)]";

/** Apply form band on iPhone — same viewport scale as track sections. */
export const JOIN_MOBILE_APPLY_SECTION = JOIN_MOBILE_TRACK_SECTION;

/** Desktop hero — same proportions as mobile, capped for wide screens. */
export const JOIN_DESKTOP_HERO_HEIGHT = "min-h-[min(72vh,44rem)] h-[min(72vh,44rem)]";

/** Half of join desktop hero height. */
export const JOIN_DESKTOP_CARD_HEIGHT = "min-h-[min(36vh,22rem)] h-[min(36vh,22rem)]";

export const JOIN_DESKTOP_TRACK_GAP = "mt-14";
export const JOIN_DESKTOP_VIEWPORT_SPACER = "min-h-[100dvh] h-[100dvh]";
