import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

/** Admin iPhone horizontal inset — matches join/blog carousel band. */
export const ADMIN_MOBILE_PAGE_INSET_X = BLOG_PAGE_INSET_X;

/** Clears fixed iPhone site nav — tight band below nav chrome. */
export const ADMIN_MOBILE_NAV_CLEARANCE =
  "pt-[calc(env(safe-area-inset-top,0px)+clamp(5rem,4.25rem+2.75vmin,6rem))]";

/** Small gap between site nav clearance and panel content. */
export const ADMIN_MOBILE_CONTENT_TOP_PAD =
  "pt-8 iphone-page:pt-10";

/** Breathing room above the bottom tab bar. */
export const ADMIN_MOBILE_CONTENT_BOTTOM_PAD =
  "pb-8 iphone-page:pb-10";

/** Gap below the refresh row before tab panels. */
export const ADMIN_MOBILE_REFRESH_ROW_GAP =
  "mb-6 iphone-page:mb-8";

/** Extra scroll padding inside scrollable panel regions. */
export const ADMIN_MOBILE_PANEL_SCROLL_PAD =
  "pb-8 iphone-page:pb-10";

/** Fixed bottom tab bar height reserve — matches tab row + safe area. */
export const ADMIN_MOBILE_TAB_BAR_RESERVE =
  "pb-[max(10.5rem,calc(env(safe-area-inset-bottom,0px)+9.75rem))] iphone-page:pb-[max(11.25rem,calc(env(safe-area-inset-bottom,0px)+10.5rem))]";

/** Vertical rhythm between major mobile admin blocks. */
export const ADMIN_MOBILE_CONTENT_STACK =
  "flex flex-col gap-6 iphone-page:gap-7";

/** Vertical rhythm inside signups/analytics panels on iPhone. */
export const ADMIN_MOBILE_PANEL_STACK =
  "flex flex-col gap-5 iphone-page:gap-6";

export const ADMIN_MOBILE_SECTION_TITLE_TW = `text-[clamp(2rem,1.65rem+1.4vmin,2.65rem)] iphone-page:text-[clamp(2.45rem,2rem+2.05vmin,3.25rem)] font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] ${suisseIntl.className}`;

export const ADMIN_MOBILE_LABEL_TW =
  "text-[clamp(0.88rem,0.76rem+0.45vmin,1rem)] iphone-page:text-[clamp(0.96rem,0.82rem+0.55vmin,1.08rem)] font-semibold uppercase tracking-[0.14em] text-neutral-400";

export const ADMIN_MOBILE_BODY_TW = `text-[clamp(1.25rem,1.08rem+0.65vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.12rem+1vmin,1.58rem)] font-medium leading-snug text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_META_TW = `text-[clamp(1.1rem,0.96rem+0.55vmin,1.25rem)] iphone-page:text-[clamp(1.2rem,1rem+0.78vmin,1.38rem)] font-medium leading-snug text-neutral-500 ${inter.className}`;

export const ADMIN_MOBILE_STAT_VALUE_TW =
  "text-[clamp(2.5rem,2.05rem+1.75vmin,3.35rem)] iphone-page:text-[clamp(2.9rem,2.35rem+2.3vmin,3.85rem)] font-medium leading-none tabular-nums tracking-tight text-neutral-900";

export const ADMIN_MOBILE_LIST_NAME_TW = `text-[clamp(1.32rem,1.12rem+0.78vmin,1.52rem)] iphone-page:text-[clamp(1.45rem,1.2rem+1.1vmin,1.68rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`;

export const ADMIN_MOBILE_DETAIL_TITLE_TW = `text-[clamp(2.25rem,1.82rem+1.65vmin,2.85rem)] iphone-page:text-[clamp(2.6rem,2.1rem+2vmin,3.15rem)] font-normal tracking-tight text-neutral-900 ${lora.className}`;

export const ADMIN_MOBILE_CHART_TITLE_TW = `text-[clamp(1.32rem,1.12rem+0.78vmin,1.52rem)] iphone-page:text-[clamp(1.45rem,1.2rem+1.1vmin,1.68rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`;

export const ADMIN_MOBILE_CARD_RADIUS = "rounded-2xl iphone-page:rounded-[1.35rem]";

export const ADMIN_MOBILE_SURFACE =
  `border border-[#E8E8E8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${ADMIN_MOBILE_CARD_RADIUS}`;

export const ADMIN_MOBILE_STAT_GRID =
  "grid grid-cols-2 gap-4 iphone-page:gap-5";

export const ADMIN_MOBILE_STAT_TILE =
  "flex min-h-[6.75rem] flex-col justify-center p-5 iphone-page:min-h-[7.25rem] iphone-page:p-[1.375rem]";

export const ADMIN_MOBILE_INPUT_H =
  "h-[4rem] iphone-page:h-[4.5rem]";

export const ADMIN_MOBILE_FIELD_TEXT_TW = `text-[clamp(1.25rem,1.08rem+0.6vmin,1.38rem)] iphone-page:text-[1.38rem] font-medium text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_INPUT_TEXT_TW = `min-w-0 flex-1 bg-transparent outline-none placeholder:font-normal placeholder:text-neutral-400 ${ADMIN_MOBILE_FIELD_TEXT_TW}`;

export const ADMIN_MOBILE_CONTROL_SURFACE =
  `${ADMIN_MOBILE_SURFACE} overflow-hidden`;

export const ADMIN_MOBILE_CONTROL_ICON_TW =
  "h-[1.5rem] w-[1.5rem] shrink-0 text-neutral-400 iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";

export const ADMIN_MOBILE_BACK_BUTTON_TW = `inline-flex w-full items-center gap-4 ${ADMIN_MOBILE_INPUT_H} rounded-2xl border border-[#E8E8E8] bg-white px-5 text-[clamp(1.25rem,1.08rem+0.6vmin,1.38rem)] iphone-page:gap-4 iphone-page:rounded-[1.35rem] iphone-page:px-6 iphone-page:text-[1.38rem] font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-neutral-50 active:bg-neutral-100 ${inter.className}`;

export const ADMIN_MOBILE_BACK_ICON_TW =
  "h-[1.5rem] w-[1.5rem] shrink-0 text-neutral-500 iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";

export const ADMIN_MOBILE_SELECT_CHEVRON_TW =
  "pointer-events-none absolute right-5 top-1/2 h-[1.5rem] w-[1.5rem] -translate-y-1/2 text-neutral-400 iphone-page:right-6 iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";

export const ADMIN_MOBILE_LIST_AVATAR_TW =
  "flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] text-[1.05rem] font-semibold text-white iphone-page:h-[4.25rem] iphone-page:w-[4.25rem] iphone-page:text-[1.15rem]";

export const ADMIN_MOBILE_LIST_ROW_PAD =
  "px-5 py-5 iphone-page:px-6 iphone-page:py-[1.375rem]";

export const ADMIN_MOBILE_CHART_PADDING = "p-6 iphone-page:p-8";

export const ADMIN_MOBILE_BUTTON_TW = `inline-flex items-center justify-center rounded-xl border border-[#E2E2E2] bg-white px-5 text-[clamp(1.1rem,1rem+0.55vmin,1.28rem)] iphone-page:px-6 iphone-page:text-[1.22rem] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-60 ${inter.className}`;

export const ADMIN_MOBILE_STACK_GAP =
  "gap-4 iphone-page:gap-5";

export const ADMIN_MOBILE_SECTION_GAP =
  "space-y-5 iphone-page:space-y-6";

export const ADMIN_MOBILE_CHART_STACK =
  "flex flex-col gap-5 iphone-page:gap-6";

/** Bottom tab bar inner padding — mirrors page horizontal inset. */
export const ADMIN_MOBILE_TAB_BAR_INSET =
  "px-11 pt-3 iphone-page:px-[max(1.65rem,calc(env(safe-area-inset-left,0px)+3.8vmin))] iphone-page:pt-3.5";

export const ADMIN_MOBILE_TAB_BAR_SAFE_BOTTOM =
  "pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]";

export const ADMIN_MOBILE_TAB_BUTTON_TW =
  "flex min-h-[5.75rem] flex-1 items-center justify-center gap-4 rounded-[1.15rem] px-5 py-4 text-[1.2rem] font-medium iphone-page:min-h-[6.1rem] iphone-page:gap-4 iphone-page:rounded-2xl iphone-page:px-6 iphone-page:py-4.5 iphone-page:text-[1.28rem]";

export const ADMIN_MOBILE_TAB_ICON_TW =
  "h-[2rem] w-[2rem] shrink-0 iphone-page:h-[2.2rem] iphone-page:w-[2.2rem]";

export const ADMIN_MOBILE_TAB_BADGE_TW =
  "shrink-0 rounded-full bg-neutral-100 px-3.5 py-1.5 text-[1rem] font-semibold tabular-nums text-neutral-600 iphone-page:px-4 iphone-page:py-2 iphone-page:text-[1.06rem]";
