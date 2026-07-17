import { inter } from "@/lib/home/fonts";

/** iPhone nav — large controls with desktop proportions (rounded-md, font-medium, square toggle). */
export const MOBILE_NAV_ACTION_HEIGHT_TW =
  "min-h-[3.65rem] py-3.5 iphone-page:min-h-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)] iphone-page:py-[clamp(0.95rem,0.72rem+1.08vmin,1.22rem)]";

export const MOBILE_NAV_ACTION_SQUARE_TW =
  "!min-w-[3.65rem] !w-[3.65rem] !px-0 iphone-page:!min-w-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)] iphone-page:!w-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)]";

export const MOBILE_NAV_ACTION_CTA_LAYOUT = `inline-flex shrink-0 items-center justify-center ${MOBILE_NAV_ACTION_HEIGHT_TW} leading-none transition-opacity hover:opacity-90 active:opacity-80 ${inter.className}`;

export const MOBILE_NAV_ACTION_CTA_BASE = `${MOBILE_NAV_ACTION_CTA_LAYOUT} rounded-md bg-black font-medium text-white`;

export const MOBILE_NAV_MAIL_BUTTON_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} aspect-square rounded-md ${MOBILE_NAV_ACTION_SQUARE_TW}`;

export const MOBILE_NAV_MAIL_ICON_TW =
  "h-[1.25rem] w-[1.25rem] iphone-page:h-[clamp(1.28rem,1.1rem+0.75vmin,1.48rem)] iphone-page:w-[clamp(1.28rem,1.1rem+0.75vmin,1.48rem)]";

export const MOBILE_NAV_SPLIT_LINK_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} rounded-none px-7 font-medium text-[0.9375rem] iphone-page:px-[clamp(1.05rem,0.82rem+1.05vmin,1.35rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.62vmin,1.18rem)]`;

export const MOBILE_NAV_SPLIT_TOGGLE_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} aspect-square rounded-none border-l ${MOBILE_NAV_ACTION_SQUARE_TW}`;

export const MOBILE_NAV_SPLIT_SHELL_TW = "relative flex items-stretch overflow-visible rounded-md";

export const MOBILE_NAV_SPLIT_INNER_TW = "flex items-stretch overflow-hidden rounded-md";

export const MOBILE_NAV_DROPDOWN_ATTACH_TW =
  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-md";

export const MOBILE_NAV_CTA_DROPDOWN_ATTACH_TW =
  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-md py-1 iphone-page:py-1.5";

/** Shared label class — home dusk CSS targets this on links and static spans (doehealth.care). */
export const MOBILE_NAV_CTA_LABEL_CLASS = `${MOBILE_NAV_SPLIT_LINK_TW} proto-nav-cta-label no-underline`;

export function mobileNavCtaInlineStyle({
  bg,
  fg,
  shadow,
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
}) {
  if (bg == null && fg == null && (shadow == null || shadow === "none")) {
    return undefined;
  }

  return {
    backgroundColor: bg ?? "#000000",
    color: fg ?? "#ffffff",
    ...(shadow && shadow !== "none" ? { boxShadow: shadow } : {}),
  } as const;
}
