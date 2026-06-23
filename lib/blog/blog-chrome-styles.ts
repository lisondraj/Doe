import { dmSans, inter, lora } from "@/lib/home/fonts";

/** Blog nav — rem-only (no vmin/vw) so html font-size scaling applies everywhere. */
export const BLOG_NAV_INSET_X =
  "px-11 iphone-page:pl-[max(1.65rem,calc(env(safe-area-inset-left,0px)+0px))] iphone-page:pr-[max(1.65rem,env(safe-area-inset-right,0px))]";

export const BLOG_NAV_DOE_LEFT =
  "left-11 iphone-page:left-[max(1.65rem,calc(env(safe-area-inset-left,0px)+0px))]";

export const BLOG_NAV_STRIP_TW = `${BLOG_NAV_INSET_X} py-6 iphone-page:py-4 flex items-center relative z-10 iphone-page:gap-3 justify-end`;

export const BLOG_NAV_LOGO_TW = `absolute top-1/2 -translate-y-1/2 font-normal z-[1] min-w-0 whitespace-nowrap transition-opacity duration-500 ease-out ${lora.className} text-4xl iphone-page:text-[2.75rem] iphone-page:leading-none opacity-100`;

export const BLOG_NAV_WAITLIST_TW = `inline-flex shrink-0 items-center justify-center rounded-[10px] bg-black font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 min-h-[3.35rem] px-6 py-3 text-[1.0625rem] leading-none iphone-page:min-h-[3.75rem] iphone-page:px-7 iphone-page:py-3 iphone-page:text-[1.15rem] iphone-page:rounded-xl ${inter.className}`;

export const BLOG_NAV_MENU_BTN_TW =
  "flex items-center justify-center p-3 iphone-page:p-3 rounded-xl transition-colors active:bg-black/[0.04]";

export const BLOG_NAV_MENU_ICON_TW = "w-9 h-9 iphone-page:w-[2.35rem] iphone-page:h-[2.35rem]";

/** Blog footer copy — rem-only. */
export const BLOG_FOOTER_CONTENT_INSET =
  "pl-14 pr-14 iphone-page:pl-[2.35rem] iphone-page:pr-[2.35rem]";

export const BLOG_FOOTER_BODY_TW = `min-w-0 shrink text-left text-white ${inter.className} text-[1.28rem] font-normal leading-[1.38] tracking-[-0.01em] iphone-page:text-[1.2rem]`;

export const BLOG_FOOTER_TITLE_TW =
  "text-[1.45rem] font-semibold leading-[1.16] iphone-page:text-[1.35rem]";

export const BLOG_FOOTER_NAV_TW =
  "flex shrink-0 flex-col items-end gap-4 text-right text-[1.48rem] font-medium leading-[1.1] tracking-tight iphone-page:gap-3.5 iphone-page:text-[1.38rem]";

export const BLOG_FOOTER_WORDMARK_SIZE = "11rem";

/** Feature card height — rem-only (vmin boxes ignore html font-size scaling). */
export const BLOG_FEATURE_BOX_HEIGHT =
  "min-h-[21rem] h-[21rem] iphone-page:min-h-[22.5rem] iphone-page:h-[22.5rem]";

/** Section vertical gaps — rem-only. */
export const BLOG_SECTION_GAP = "mt-10 iphone-page:mt-12";
export const BLOG_LIST_SECTION_GAP = "mt-12 iphone-page:mt-16";
export const BLOG_LANDING_HERO_GAP = "mt-14 iphone-page:mt-[2.35rem]";
export const BLOG_TITLE_VISUAL_GAP = "mt-28 iphone-page:mt-[4.7rem]";
export const BLOG_STACK_GAP = BLOG_LANDING_HERO_GAP;

/** Article h2 / quote — rem-only. */
export const BLOG_ARTICLE_H2_TW = `text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[1.52rem] iphone-page:text-[1.72rem] ${dmSans.className}`;
export const BLOG_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[1.85rem] iphone-page:text-[2.1rem] ${lora.className}`;
export const BLOG_ARTICLE_QUOTE_ATTR_TW = `font-medium text-[#9A8F82] text-[1.08rem] iphone-page:text-[1.22rem] ${dmSans.className}`;

/** Blog page horizontal gutter — rem-only. */
export const BLOG_PAGE_INSET_X_REM =
  "px-14 iphone-page:px-[2.35rem]";

export const BLOG_CONTENT_PT_REM =
  "pt-[11.25rem] iphone-page:pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))]";

export const BLOG_FOOTER_GAP_REM =
  "pb-[3.5rem] iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+3rem))]";
