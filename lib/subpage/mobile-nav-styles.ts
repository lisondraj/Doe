import { inter } from "@/lib/home/fonts";

/** iPhone main/about nav — larger mail + investors controls. */
export const MOBILE_NAV_ACTION_CTA_BASE = `inline-flex shrink-0 items-center justify-center rounded-[10px] bg-black font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 min-h-[3.65rem] py-3.5 leading-none iphone-page:min-h-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)] iphone-page:py-[clamp(0.95rem,0.72rem+1.08vmin,1.22rem)] iphone-page:rounded-[clamp(0.72rem,0.58rem+0.52vmin,0.92rem)] ${inter.className}`;

export const MOBILE_NAV_MAIL_BUTTON_TW = `${MOBILE_NAV_ACTION_CTA_BASE} aspect-square !min-w-[3.65rem] !w-[3.65rem] !px-0 iphone-page:!min-w-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)] iphone-page:!w-[clamp(3.9rem,3.15rem+3.45vmin,4.75rem)]`;

export const MOBILE_NAV_MAIL_ICON_TW =
  "h-[1.35rem] w-[1.35rem] iphone-page:h-[clamp(1.28rem,1.1rem+0.75vmin,1.48rem)] iphone-page:w-[clamp(1.28rem,1.1rem+0.75vmin,1.48rem)]";

export const MOBILE_NAV_SPLIT_LINK_TW = `${MOBILE_NAV_ACTION_CTA_BASE} rounded-none px-4 text-[1.0625rem] iphone-page:px-[clamp(1.05rem,0.82rem+1.05vmin,1.35rem)] iphone-page:text-[clamp(1.08rem,0.95rem+0.88vmin,1.28rem)]`;

export const MOBILE_NAV_SPLIT_TOGGLE_TW = `${MOBILE_NAV_ACTION_CTA_BASE} rounded-none border-l border-white/20 px-2.5 iphone-page:px-[clamp(0.62rem,0.48rem+0.58vmin,0.78rem)]`;

export const MOBILE_NAV_SPLIT_SHELL_TW =
  "relative flex items-stretch overflow-visible rounded-[10px] iphone-page:rounded-[clamp(0.72rem,0.58rem+0.52vmin,0.92rem)]";

export const MOBILE_NAV_SPLIT_INNER_TW =
  "flex items-stretch overflow-hidden rounded-[10px] iphone-page:rounded-[clamp(0.72rem,0.58rem+0.52vmin,0.92rem)]";

export const MOBILE_NAV_DROPDOWN_ATTACH_TW =
  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-[10px] iphone-page:rounded-[clamp(0.72rem,0.58rem+0.52vmin,0.92rem)]";
