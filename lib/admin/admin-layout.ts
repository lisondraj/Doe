import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

/** Admin iPhone horizontal inset — matches join/blog carousel band. */
export const ADMIN_MOBILE_PAGE_INSET_X = BLOG_PAGE_INSET_X;

/** Clears fixed iPhone nav above admin content. */
export const ADMIN_MOBILE_NAV_CLEARANCE =
  "pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))]";

/** Fixed bottom tab bar height reserve — matches tab row + safe area. */
export const ADMIN_MOBILE_TAB_BAR_RESERVE =
  "pb-[max(7.75rem,calc(env(safe-area-inset-bottom,0px)+7.25rem))] iphone-page:pb-[max(8.5rem,calc(env(safe-area-inset-bottom,0px)+7.75rem))]";

/** Vertical rhythm between major mobile admin blocks. */
export const ADMIN_MOBILE_CONTENT_STACK =
  "flex flex-col gap-6 iphone-page:gap-7";

/** Vertical rhythm inside signups/analytics panels on iPhone. */
export const ADMIN_MOBILE_PANEL_STACK =
  "flex flex-col gap-5 iphone-page:gap-6";

export const ADMIN_MOBILE_SECTION_TITLE_TW = `text-[clamp(1.85rem,1.5rem+1.25vmin,2.45rem)] iphone-page:text-[clamp(2.25rem,1.82rem+1.9vmin,3rem)] font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] ${suisseIntl.className}`;

export const ADMIN_MOBILE_PAGE_TITLE_TW = `text-[clamp(2.25rem,1.85rem+1.7vmin,2.9rem)] iphone-page:text-[clamp(2.65rem,2.15rem+2.3vmin,3.45rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] ${lora.className}`;

export const ADMIN_MOBILE_SUBTITLE_TW = `text-[clamp(1.15rem,1rem+0.6vmin,1.32rem)] iphone-page:text-[clamp(1.28rem,1.05rem+0.95vmin,1.5rem)] font-medium leading-snug text-[#1E343A]/55 ${inter.className}`;

export const ADMIN_MOBILE_LABEL_TW =
  "text-[clamp(0.8rem,0.7rem+0.4vmin,0.92rem)] iphone-page:text-[clamp(0.88rem,0.76rem+0.5vmin,1rem)] font-semibold uppercase tracking-[0.14em] text-neutral-400";

export const ADMIN_MOBILE_BODY_TW = `text-[clamp(1.15rem,1rem+0.6vmin,1.32rem)] iphone-page:text-[clamp(1.28rem,1.05rem+0.9vmin,1.48rem)] font-medium leading-snug text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_META_TW = `text-[clamp(1.02rem,0.9rem+0.5vmin,1.15rem)] iphone-page:text-[clamp(1.1rem,0.94rem+0.7vmin,1.28rem)] font-medium leading-snug text-neutral-500 ${inter.className}`;

export const ADMIN_MOBILE_STAT_VALUE_TW =
  "text-[clamp(2.25rem,1.85rem+1.6vmin,3rem)] iphone-page:text-[clamp(2.65rem,2.15rem+2.1vmin,3.45rem)] font-medium leading-none tabular-nums tracking-tight text-neutral-900";

export const ADMIN_MOBILE_LIST_NAME_TW = `text-[clamp(1.22rem,1.05rem+0.7vmin,1.4rem)] iphone-page:text-[clamp(1.35rem,1.12rem+1vmin,1.55rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`;

export const ADMIN_MOBILE_DETAIL_TITLE_TW = `text-[clamp(2.05rem,1.65rem+1.5vmin,2.6rem)] iphone-page:text-[clamp(2.35rem,1.9rem+1.85vmin,2.9rem)] font-normal tracking-tight text-neutral-900 ${lora.className}`;

export const ADMIN_MOBILE_CHART_TITLE_TW = `text-[clamp(1.22rem,1.05rem+0.7vmin,1.4rem)] iphone-page:text-[clamp(1.35rem,1.12rem+1vmin,1.55rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`;

export const ADMIN_MOBILE_CARD_RADIUS = "rounded-2xl iphone-page:rounded-[1.35rem]";

export const ADMIN_MOBILE_SURFACE =
  `border border-[#E8E8E8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${ADMIN_MOBILE_CARD_RADIUS}`;

export const ADMIN_MOBILE_STAT_GRID =
  "grid grid-cols-2 gap-4 iphone-page:gap-5";

export const ADMIN_MOBILE_STAT_TILE =
  "flex min-h-[6rem] flex-col justify-center p-[1.125rem] iphone-page:min-h-[6.5rem] iphone-page:p-5";

export const ADMIN_MOBILE_INPUT_H =
  "h-[3.65rem] iphone-page:h-[4.1rem]";

export const ADMIN_MOBILE_FIELD_TEXT_TW = `text-[clamp(1.15rem,1rem+0.55vmin,1.28rem)] iphone-page:text-[1.28rem] font-medium text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_INPUT_TEXT_TW = `min-w-0 flex-1 bg-transparent outline-none placeholder:font-normal placeholder:text-neutral-400 ${ADMIN_MOBILE_FIELD_TEXT_TW}`;

export const ADMIN_MOBILE_CONTROL_SURFACE =
  `${ADMIN_MOBILE_SURFACE} overflow-hidden`;

export const ADMIN_MOBILE_CONTROL_ICON_TW =
  "h-[1.35rem] w-[1.35rem] shrink-0 text-neutral-400 iphone-page:h-[1.55rem] iphone-page:w-[1.55rem]";

export const ADMIN_MOBILE_BACK_BUTTON_TW = `inline-flex w-full items-center gap-3.5 ${ADMIN_MOBILE_INPUT_H} rounded-2xl border border-[#E8E8E8] bg-white px-5 text-[clamp(1.15rem,1rem+0.55vmin,1.28rem)] iphone-page:gap-4 iphone-page:rounded-[1.35rem] iphone-page:px-6 iphone-page:text-[1.28rem] font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-neutral-50 active:bg-neutral-100 ${inter.className}`;

export const ADMIN_MOBILE_BACK_ICON_TW =
  "h-[1.35rem] w-[1.35rem] shrink-0 text-neutral-500 iphone-page:h-[1.55rem] iphone-page:w-[1.55rem]";

export const ADMIN_MOBILE_SELECT_CHEVRON_TW =
  "pointer-events-none absolute right-5 top-1/2 h-[1.35rem] w-[1.35rem] -translate-y-1/2 text-neutral-400 iphone-page:right-6 iphone-page:h-[1.55rem] iphone-page:w-[1.55rem]";

export const ADMIN_MOBILE_LIST_AVATAR_TW =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] text-[0.95rem] font-semibold text-white iphone-page:h-16 iphone-page:w-16 iphone-page:text-[1.05rem]";

export const ADMIN_MOBILE_LIST_ROW_PAD =
  "px-5 py-[1.125rem] iphone-page:px-6 iphone-page:py-5";

export const ADMIN_MOBILE_CHART_PADDING = "p-6 iphone-page:p-7";

export const ADMIN_MOBILE_BUTTON_TW = `inline-flex items-center justify-center rounded-xl border border-[#E2E2E2] bg-white px-5 text-[clamp(1.05rem,0.95rem+0.5vmin,1.2rem)] iphone-page:px-6 iphone-page:text-[1.15rem] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-60 ${inter.className}`;

export const ADMIN_MOBILE_STACK_GAP =
  "gap-4 iphone-page:gap-5";

export const ADMIN_MOBILE_SECTION_GAP =
  "space-y-5 iphone-page:space-y-6";

export const ADMIN_MOBILE_CHART_STACK =
  "flex flex-col gap-5 iphone-page:gap-6";

/** Bottom tab bar inner padding — mirrors page horizontal inset. */
export const ADMIN_MOBILE_TAB_BAR_INSET =
  "px-14 pt-4 iphone-page:px-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:pt-4.5";

export const ADMIN_MOBILE_TAB_BUTTON_TW =
  "flex min-h-[5.25rem] flex-1 items-center justify-center gap-3.5 rounded-[1.15rem] px-5 py-4 text-[1.125rem] font-medium iphone-page:min-h-[5.65rem] iphone-page:gap-4 iphone-page:rounded-2xl iphone-page:px-6 iphone-page:py-4.5 iphone-page:text-[1.2rem]";

export const ADMIN_MOBILE_TAB_ICON_TW =
  "h-[1.85rem] w-[1.85rem] shrink-0 iphone-page:h-[2.05rem] iphone-page:w-[2.05rem]";

export const ADMIN_MOBILE_TAB_BADGE_TW =
  "shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-[0.95rem] font-semibold tabular-nums text-neutral-600 iphone-page:px-3.5 iphone-page:py-1.5 iphone-page:text-[1rem]";

export const ADMIN_MOBILE_HEADER_LOGO_TW =
  "h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm iphone-page:h-16 iphone-page:w-16 iphone-page:rounded-[1.1rem]";
