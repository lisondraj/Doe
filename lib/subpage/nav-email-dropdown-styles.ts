import { dmSans, inter } from "@/lib/home/fonts";

export const NAV_EMAIL_DROPDOWN_BG = "#000000";
export const NAV_EMAIL_DROPDOWN_FG = "#ffffff";
export const NAV_EMAIL_DROPDOWN_DIVIDER = "rgba(255, 255, 255, 0.22)";

/** Left-aligned to the mail button (legacy). */
export const NAV_EMAIL_DROPDOWN_ATTACH_TW =
  "absolute left-0 top-[calc(100%+0.5rem)] z-[60] min-w-max overflow-hidden rounded-md";

/** Right edge flush with the For Investors split button in the nav action row. */
export const NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW =
  "absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-max overflow-hidden rounded-md";

export const NAV_EMAIL_DROPDOWN_PANEL_TW = `border px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] iphone-page:px-[clamp(1.05rem,0.86rem+0.95vmin,1.28rem)] iphone-page:py-[clamp(0.95rem,0.76rem+0.95vmin,1.15rem)]`;

export const NAV_EMAIL_DROPDOWN_ADDRESS_TW = `whitespace-nowrap text-[1.0625rem] font-medium tracking-[-0.02em] md:text-[1.1875rem] lg:text-[1.3125rem] iphone-page:text-[clamp(1.08rem,0.95rem+0.72vmin,1.28rem)] ${inter.className}`;

export const NAV_EMAIL_DROPDOWN_COPIED_TW = `mt-2.5 flex items-center gap-1.5 text-sm font-normal text-white/72 md:mt-3 iphone-page:mt-3 iphone-page:gap-2 iphone-page:text-[clamp(0.98rem,0.88rem+0.62vmin,1.12rem)] ${dmSans.className}`;

export const NAV_EMAIL_DROPDOWN_CHECK_TW = "h-4 w-4 shrink-0 iphone-page:h-[clamp(1rem,0.9rem+0.45vmin,1.12rem)] iphone-page:w-[clamp(1rem,0.9rem+0.45vmin,1.12rem)]";

/** iPhone — scaled investors CTA menu items. */
export const MOBILE_NAV_CTA_DROPDOWN_ITEM_TW = `block px-4 py-2.5 text-sm font-medium no-underline transition-colors iphone-page:px-[clamp(1.05rem,0.86rem+0.95vmin,1.28rem)] iphone-page:py-[clamp(0.82rem,0.66rem+0.82vmin,1rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.62vmin,1.18rem)]`;
