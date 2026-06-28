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
  "We intend to register as a C-corporation",
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

export const ABOUT_DESKTOP_MAIN_PT = "pt-[5.5rem]";

/** One full-viewport /about desktop band. */
export const ABOUT_DESKTOP_SECTION_H = "box-border min-h-[100dvh] h-[100dvh]";

/** Hero band — exactly one viewport; headline + gradient box only. */
export const ABOUT_DESKTOP_SECTION_1_H = "box-border h-[100dvh] max-h-[100dvh] overflow-hidden";

/** Vertically centered section content with page gutters. */
export const ABOUT_DESKTOP_SECTION_LAYOUT = `flex flex-col justify-center ${ABOUT_DESKTOP_PAGE_INSET}`;

/** Hero band — clears fixed nav; headline stack + flex hero fill remaining height. */
export const ABOUT_DESKTOP_SECTION_1_LAYOUT = `flex min-h-0 flex-col ${ABOUT_DESKTOP_PAGE_INSET} ${ABOUT_DESKTOP_MAIN_PT} pb-8 md:pb-10 lg:pb-12 xl:pb-14`;

export const ABOUT_DESKTOP_TITLE_TW = `text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(2.85rem,4.1vw,4.25rem)] md:text-[clamp(3.1rem,3.75vw,4.45rem)] lg:text-[clamp(3.3rem,3.55vw,4.65rem)] text-[#1E343A] ${suisseIntl.className}`;

export const ABOUT_DESKTOP_SUBHEADING_TW = `mt-2.5 md:mt-3 text-[clamp(1.38rem,1.25vw,1.62rem)] md:text-[clamp(1.48rem,1.35vw,1.72rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Desktop /about byline — same copy as iPhone, gap matches title→subheading rhythm. */
export const ABOUT_DESKTOP_BYLINE_TW = `mt-2.5 md:mt-3 font-medium text-[#9A8F82] text-[clamp(1.12rem,1vw,1.32rem)] md:text-[clamp(1.22rem,1.05vw,1.42rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_MAX_W = "max-w-[min(100%,54rem)]";

export const ABOUT_DESKTOP_SECTION_GRID = "grid w-full grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-12 xl:gap-16";

export const ABOUT_DESKTOP_BEIGE_PANEL_TW = DOEPHONE_SECTION_CAROUSEL_RADIUS;

export const ABOUT_DESKTOP_CONTENT_STACK_GAP = "gap-10 md:gap-12";

export const ABOUT_DESKTOP_STACK_GAP = "gap-12 md:gap-14";

export const ABOUT_DESKTOP_CHART_CITATION_TW = `mt-3 md:mt-4 font-normal leading-snug text-[#9A8F82] text-[clamp(0.92rem,0.85vw,1.05rem)] md:text-[clamp(0.98rem,0.9vw,1.1rem)] ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_SECTION_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_HERO_WRAP = "mt-5 md:mt-6 flex min-h-0 w-full flex-1 flex-col";

export const ABOUT_DESKTOP_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} h-full min-h-0 w-full flex-1`;

export const ABOUT_DESKTOP_ARTICLE_BODY_TW = `text-[clamp(1.12rem,1.05vw,1.32rem)] md:text-[clamp(1.22rem,1.1vw,1.42rem)] font-normal leading-[1.5] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_VISUAL_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_ARTICLE_H2_TW = `text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.55rem,1.35vw,1.95rem)] md:text-[clamp(1.72rem,1.45vw,2.1rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.85rem,1.65vw,2.35rem)] md:text-[clamp(2.05rem,1.85vw,2.65rem)] ${lora.className}`;

export const ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW = `mt-5 md:mt-6 font-medium text-[#9A8F82] text-[clamp(1.12rem,1vw,1.32rem)] md:text-[clamp(1.22rem,1.05vw,1.42rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_LIST_GAP = "space-y-3 md:space-y-3.5";
