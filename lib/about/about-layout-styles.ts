import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_COPY_TW,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

/** About page mission headline — matches iPhone main page section titles. */
export const ABOUT_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** Fundraising subheading — fixed two-line break aligned to mission title. */
export const ABOUT_PAGE_SUBHEADING_LINES = [
  "We intend to register as a Delaware C-corporation",
  "and are actively raising a pre-seed round.",
] as const;

/** About subheading — customization-section description style, scaled up. */
export const ABOUT_PAGE_SUBHEADING_TW = `mt-[clamp(0.85rem,0.65rem+0.85vmin,1.25rem)] text-[clamp(1.42rem,1.22rem+0.95vmin,1.78rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.35vmin,2.12rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Mission headline block — subheading wraps to the title column width. */
export const ABOUT_HERO_HEADLINE_WRAP = "w-fit max-w-full";

/** Extra space below nav clearance before mission headline. */
export const ABOUT_PAGE_HERO_HEADLINE_PT = "mt-2 iphone-page:mt-3";

/** About hero — article section spacing after subheading and before body copy. */
export const ABOUT_PAGE_HERO_AFTER_SUBHEADING = "mt-10 iphone-page:mt-12";

export const ABOUT_PAGE_HERO_BEFORE_ARTICLE = "mb-10 iphone-page:mb-12";

export const ABOUT_PAGE_HERO_WRAP = `${ABOUT_PAGE_HERO_AFTER_SUBHEADING} ${ABOUT_PAGE_HERO_BEFORE_ARTICLE}`;

/** iPhone /about — byline under subheading, before hero. */
export const ABOUT_PAGE_MOBILE_BYLINE_TW = `text-[clamp(1.15rem,1rem+0.65vmin,1.32rem)] iphone-page:text-[clamp(1.32rem,1.12rem+0.9vmin,1.52rem)] font-medium text-[#9A8F82] ${dmSans.className}`;

export const ABOUT_PAGE_MOBILE_BYLINE_GAP = "mt-6 iphone-page:mt-7";

export const ABOUT_PAGE_HERO_AFTER_BYLINE = "mt-8 iphone-page:mt-10";

/** iPhone /about hero box — no drop shadow under gradient band. */
export const ABOUT_PAGE_HERO_BOX_TW = `${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} shadow-none`;

/** Desktop /about — same horizontal gutters as desktop home. */
export const ABOUT_DESKTOP_PAGE_INSET = DOEPHONE_DESKTOP_PAGE_INSET_X;

/** Clears fixed nav — matches AboutDesktopNav bar height (py-6 + text-4xl). */
export const ABOUT_DESKTOP_MAIN_PT = "pt-[5.25rem]";

/** Hero band — exactly one viewport; headline + gradient box only. */
export const ABOUT_DESKTOP_SECTION_1_H = "box-border h-[100dvh] max-h-[100dvh] overflow-hidden";

/** Space below nav before mission title — matches subheading-to-hero gap. */
export const ABOUT_DESKTOP_HERO_HEADLINE_TOP = "mt-8 md:mt-10";

/** Hero band — nav clearance, uniform vertical rhythm, gradient box fills remainder. */
export const ABOUT_DESKTOP_SECTION_1_LAYOUT = `grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-y-8 md:gap-y-10 ${ABOUT_DESKTOP_PAGE_INSET} ${ABOUT_DESKTOP_MAIN_PT} pb-6 md:pb-8 lg:pb-10`;

export const ABOUT_DESKTOP_TITLE_TW = `text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(2.65rem,3.75vw,3.95rem)] md:text-[clamp(2.85rem,3.45vw,4.15rem)] lg:text-[clamp(3rem,3.25vw,4.35rem)] text-[#1E343A] ${suisseIntl.className}`;

export const ABOUT_DESKTOP_SUBHEADING_TW = `mt-5 md:mt-6 text-[clamp(1.32rem,1.2vw,1.55rem)] md:text-[clamp(1.4rem,1.28vw,1.65rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Desktop /about — author + date inside the orange hero box (bottom-right inset). */
export const ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW =
  "pointer-events-none absolute bottom-6 right-6 z-10 text-right md:bottom-8 md:right-8 lg:bottom-10 lg:right-10";

export const ABOUT_DESKTOP_HERO_BYLINE_TW = `font-medium leading-none text-white text-[clamp(0.98rem,0.88vw,1.12rem)] md:text-[clamp(1.05rem,0.92vw,1.2rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_HERO_DATE_TW = `mt-1 font-medium leading-none text-white/90 text-[clamp(0.92rem,0.82vw,1.05rem)] md:text-[clamp(0.98rem,0.86vw,1.1rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_MAX_W = "max-w-[min(100%,54rem)]";

/** One full-viewport /about desktop band. */
export const ABOUT_DESKTOP_SECTION_H = "box-border h-[100dvh] max-h-[100dvh] min-h-[100dvh] overflow-hidden";

/** Split bands — two equal columns with page gutters and vertical breathing room. */
export const ABOUT_DESKTOP_SPLIT_SECTION_GRID = `grid h-full min-h-0 w-full grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 ${ABOUT_DESKTOP_PAGE_INSET} py-8 md:py-10 lg:py-12`;

/** Shared inset for text and beige columns within each split band. */
export const ABOUT_DESKTOP_SPLIT_COLUMN_PAD = "p-6 md:p-8 lg:p-10 xl:p-12";

/** Text column when the beige panel sits on the right. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_LEFT =
  `flex min-h-0 min-w-0 flex-col justify-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** Text column when the beige panel sits on the left. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_RIGHT =
  `flex min-h-0 min-w-0 flex-col justify-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** FAQ text column — stretch tabs to match beige panel height. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_FAQ =
  `flex h-full min-h-0 min-w-0 flex-col justify-start ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** Beige square column — inset on all four sides within its half of the section. */
export const ABOUT_DESKTOP_SPLIT_BOX_COLUMN =
  `grid min-h-0 min-w-0 h-full place-items-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

export const ABOUT_DESKTOP_BEIGE_PANEL_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} aspect-square max-h-full max-w-full w-full`;

export const ABOUT_DESKTOP_CONTENT_STACK_GAP = "gap-8 md:gap-9 lg:gap-10";

export const ABOUT_DESKTOP_STACK_GAP = "gap-12 md:gap-14";

export const ABOUT_DESKTOP_CHART_CITATION_TW = `mt-3 md:mt-4 font-normal leading-snug text-[#9A8F82] text-[clamp(0.92rem,0.85vw,1.05rem)] md:text-[clamp(0.98rem,0.9vw,1.1rem)] ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_SECTION_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_HERO_WRAP = "flex min-h-0 w-full flex-col";

export const ABOUT_DESKTOP_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} h-full min-h-0 w-full flex-1`;

export const ABOUT_DESKTOP_ARTICLE_BODY_TW = `text-[clamp(1.12rem,1.05vw,1.32rem)] md:text-[clamp(1.22rem,1.1vw,1.42rem)] font-normal leading-[1.5] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Desktop /about FAQ tabs — section three accordion beside beige panel. */
export const ABOUT_DESKTOP_FAQ_LIST_TW = "grid h-full min-h-0 w-full grid-rows-4";

export const ABOUT_DESKTOP_FAQ_ITEM_TW = `text-[clamp(1.35rem,1.22vw,1.72rem)] md:text-[clamp(1.5rem,1.35vw,1.9rem)] lg:text-[clamp(1.62rem,1.45vw,2.05rem)] leading-[1.15] tracking-[-0.015em] ${inter.className}`;

export const ABOUT_DESKTOP_FAQ_ANSWER_TW = "pt-3 md:pt-4";

export const ABOUT_DESKTOP_ARTICLE_VISUAL_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_ARTICLE_H2_TW = `text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.55rem,1.35vw,1.95rem)] md:text-[clamp(1.72rem,1.45vw,2.1rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.85rem,1.65vw,2.35rem)] md:text-[clamp(2.05rem,1.85vw,2.65rem)] ${lora.className}`;

export const ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW = `mt-5 md:mt-6 font-medium text-[#9A8F82] text-[clamp(1.12rem,1vw,1.32rem)] md:text-[clamp(1.22rem,1.05vw,1.42rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_LIST_GAP = "space-y-3 md:space-y-3.5";
