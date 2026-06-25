import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

/** Admin iPhone horizontal inset — matches join/blog carousel band. */
export const ADMIN_MOBILE_PAGE_INSET_X = BLOG_PAGE_INSET_X;

/** Clears fixed iPhone nav above admin content. */
export const ADMIN_MOBILE_NAV_CLEARANCE =
  "pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))]";

/** Fixed bottom tab bar height reserve — matches tab row + safe area. */
export const ADMIN_MOBILE_TAB_BAR_RESERVE =
  "pb-[max(7rem,calc(env(safe-area-inset-bottom,0px)+6.5rem))] iphone-page:pb-[max(7.75rem,calc(env(safe-area-inset-bottom,0px)+7rem))]";

/** Vertical rhythm between major mobile admin blocks. */
export const ADMIN_MOBILE_CONTENT_STACK =
  "flex flex-col gap-5 iphone-page:gap-6";

/** Vertical rhythm inside signups/analytics panels on iPhone. */
export const ADMIN_MOBILE_PANEL_STACK =
  "flex flex-col gap-4 iphone-page:gap-5";

export const ADMIN_MOBILE_SECTION_TITLE_TW = `text-[clamp(1.65rem,1.35rem+1.15vmin,2.15rem)] iphone-page:text-[clamp(2rem,1.62rem+1.75vmin,2.65rem)] font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] ${suisseIntl.className}`;

export const ADMIN_MOBILE_PAGE_TITLE_TW = `text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] iphone-page:text-[clamp(2.35rem,1.92rem+2.1vmin,3.05rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] ${lora.className}`;

export const ADMIN_MOBILE_SUBTITLE_TW = `text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] iphone-page:text-[clamp(1.18rem,0.98rem+0.85vmin,1.38rem)] font-medium leading-snug text-[#1E343A]/55 ${inter.className}`;

export const ADMIN_MOBILE_LABEL_TW =
  "text-[clamp(0.72rem,0.64rem+0.35vmin,0.82rem)] iphone-page:text-[clamp(0.78rem,0.68rem+0.45vmin,0.9rem)] font-semibold uppercase tracking-[0.14em] text-neutral-400";

export const ADMIN_MOBILE_BODY_TW = `text-[clamp(1.05rem,0.92rem+0.55vmin,1.2rem)] iphone-page:text-[clamp(1.15rem,0.96rem+0.82vmin,1.35rem)] font-medium leading-snug text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_META_TW = `text-[clamp(0.95rem,0.84rem+0.45vmin,1.05rem)] iphone-page:text-[clamp(1.02rem,0.88rem+0.62vmin,1.15rem)] font-medium leading-snug text-neutral-500 ${inter.className}`;

export const ADMIN_MOBILE_STAT_VALUE_TW =
  "text-[clamp(2rem,1.65rem+1.45vmin,2.65rem)] iphone-page:text-[clamp(2.35rem,1.9rem+1.9vmin,3rem)] font-medium leading-none tabular-nums tracking-tight text-neutral-900";

export const ADMIN_MOBILE_LIST_NAME_TW = `text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.88vmin,1.42rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`;

export const ADMIN_MOBILE_DETAIL_TITLE_TW = `text-[clamp(1.85rem,1.5rem+1.35vmin,2.35rem)] iphone-page:text-[clamp(2.1rem,1.72rem+1.65vmin,2.65rem)] font-normal tracking-tight text-neutral-900 ${lora.className}`;

export const ADMIN_MOBILE_CARD_RADIUS = "rounded-2xl iphone-page:rounded-[1.35rem]";

export const ADMIN_MOBILE_SURFACE =
  `border border-[#E8E8E8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${ADMIN_MOBILE_CARD_RADIUS}`;

export const ADMIN_MOBILE_STAT_GRID =
  "grid grid-cols-2 gap-3 iphone-page:gap-4";

export const ADMIN_MOBILE_STAT_TILE =
  "flex min-h-[5.25rem] flex-col justify-center p-4 iphone-page:min-h-[5.5rem] iphone-page:p-[1.125rem]";

export const ADMIN_MOBILE_INPUT_H =
  "h-[3.25rem] iphone-page:h-[3.65rem]";

export const ADMIN_MOBILE_FIELD_TEXT_TW = `text-[clamp(1.05rem,0.92rem+0.5vmin,1.15rem)] iphone-page:text-[1.125rem] font-medium text-neutral-800 ${inter.className}`;

export const ADMIN_MOBILE_INPUT_TEXT_TW = `min-w-0 flex-1 bg-transparent outline-none placeholder:font-normal placeholder:text-neutral-400 ${ADMIN_MOBILE_FIELD_TEXT_TW}`;

export const ADMIN_MOBILE_CONTROL_SURFACE =
  `${ADMIN_MOBILE_SURFACE} overflow-hidden`;

export const ADMIN_MOBILE_BACK_BUTTON_TW = `inline-flex w-full items-center gap-3 ${ADMIN_MOBILE_INPUT_H} rounded-2xl border border-[#E8E8E8] bg-white px-4 text-[clamp(1.05rem,0.92rem+0.5vmin,1.15rem)] iphone-page:gap-3.5 iphone-page:rounded-[1.35rem] iphone-page:px-5 iphone-page:text-[1.125rem] font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-neutral-50 active:bg-neutral-100 ${inter.className}`;

export const ADMIN_MOBILE_BACK_ICON_TW =
  "h-5 w-5 shrink-0 text-neutral-500 iphone-page:h-[1.35rem] iphone-page:w-[1.35rem]";

export const ADMIN_MOBILE_SELECT_CHEVRON_TW =
  "pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 iphone-page:right-5 iphone-page:h-[1.35rem] iphone-page:w-[1.35rem]";

export const ADMIN_MOBILE_BUTTON_TW = `inline-flex items-center justify-center rounded-xl border border-[#E2E2E2] bg-white px-4 text-[clamp(1rem,0.9rem+0.45vmin,1.1rem)] iphone-page:px-5 iphone-page:text-[1.0625rem] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-60 ${inter.className}`;

export const ADMIN_MOBILE_STACK_GAP =
  "gap-3.5 iphone-page:gap-4";

export const ADMIN_MOBILE_SECTION_GAP =
  "space-y-4 iphone-page:space-y-5";

export const ADMIN_MOBILE_CHART_STACK =
  "flex flex-col gap-4 iphone-page:gap-5";

/** Bottom tab bar inner padding — mirrors page horizontal inset. */
export const ADMIN_MOBILE_TAB_BAR_INSET =
  "px-14 pt-3.5 iphone-page:px-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:pt-4";

export const ADMIN_MOBILE_TAB_BUTTON_TW =
  "flex min-h-[4.75rem] flex-1 items-center justify-center gap-3 rounded-[1.15rem] px-4 py-3.5 text-[1.0625rem] font-medium iphone-page:min-h-[5.15rem] iphone-page:gap-3.5 iphone-page:rounded-2xl iphone-page:px-5 iphone-page:py-4 iphone-page:text-[1.125rem]";

export const ADMIN_MOBILE_TAB_ICON_TW =
  "h-[1.65rem] w-[1.65rem] shrink-0 iphone-page:h-[1.85rem] iphone-page:w-[1.85rem]";
