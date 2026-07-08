import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_DESKTOP_PAGE_INSET_LEFT,
  DOEPHONE_DESKTOP_PAGE_INSET_RIGHT,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_COPY_TW,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import { BLOG_ARTICLE_BODY_TW } from "@/lib/blog/blog-layout-styles";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

/** About page mission headline — matches iPhone main page section titles. */
export const ABOUT_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** Fundraising subheading — fixed two-line break aligned to mission title. */
export const ABOUT_PAGE_SUBHEADING_LINES = [
  "We intend to register as a Delaware C-corporation",
  "and are actively raising a pre-seed round.",
] as const;

/** About subheading — customization-section description style, scaled up. */
export const ABOUT_PAGE_SUBHEADING_TW = `mt-[clamp(0.55rem,0.42rem+0.55vmin,0.85rem)] text-[clamp(1.42rem,1.22rem+0.95vmin,1.78rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.35vmin,2.12rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Mission headline block — subheading wraps to the title column width. */
export const ABOUT_HERO_HEADLINE_WRAP = "w-fit max-w-full";

/** Extra space below nav clearance before mission headline. */
export const ABOUT_PAGE_HERO_HEADLINE_PT = "mt-2 iphone-page:mt-3";

/** About hero — article section spacing after subheading and before body copy. */
export const ABOUT_PAGE_HERO_AFTER_SUBHEADING = "mt-10 iphone-page:mt-12";

export const ABOUT_PAGE_HERO_BEFORE_ARTICLE = "mb-10 iphone-page:mb-12";

export const ABOUT_PAGE_HERO_WRAP = `${ABOUT_PAGE_HERO_AFTER_SUBHEADING} ${ABOUT_PAGE_HERO_BEFORE_ARTICLE}`;

/** iPhone /about — byline under subheading, before hero. */
export const ABOUT_PAGE_MOBILE_BYLINE_TW = `about-page-byline text-[clamp(1.02rem,0.88rem+0.58vmin,1.22rem)] iphone-page:text-[clamp(1.08rem,0.92rem+0.62vmin,1.28rem)] font-medium text-[#BE8660] ${dmSans.className}`;

export const ABOUT_PAGE_MOBILE_BYLINE_GAP = "mt-3 iphone-page:mt-4";

export const ABOUT_PAGE_HERO_AFTER_BYLINE = "mt-4 iphone-page:mt-5";

/** iPhone /about hero box — no drop shadow under gradient band. */
export const ABOUT_PAGE_HERO_BOX_TW = `${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} shadow-none`;

/** Desktop /about — same horizontal gutters as desktop home. */
export const ABOUT_DESKTOP_PAGE_INSET = DOEPHONE_DESKTOP_PAGE_INSET_X;

/** Clears fixed punched nav — matches desktop nav height token. */
export const ABOUT_DESKTOP_MAIN_PT = "pt-[6.25rem]";

/** Hero band — exactly one viewport; headline + gradient box only. */
export const ABOUT_DESKTOP_SECTION_1_H = "about-desktop-section box-border h-[100dvh] max-h-[100dvh] overflow-hidden";

/** Space below nav before mission title — matches subheading-to-hero gap. */
export const ABOUT_DESKTOP_HERO_HEADLINE_TOP = "mt-4 md:mt-6";

/** Hero band — nav clearance + uniform vertical rhythm, gradient box fills remainder. */
export const ABOUT_DESKTOP_SECTION_1_LAYOUT =
  "about-desktop-section__inner grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-y-6 md:gap-y-8";

export const ABOUT_DESKTOP_TITLE_TW = `text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(2.65rem,3.75vw,3.95rem)] md:text-[clamp(2.85rem,3.45vw,4.15rem)] lg:text-[clamp(3rem,3.25vw,4.35rem)] text-[#1E343A] ${suisseIntl.className}`;

export const ABOUT_DESKTOP_SUBHEADING_TW = `mt-5 md:mt-6 text-[clamp(1.32rem,1.2vw,1.55rem)] md:text-[clamp(1.4rem,1.28vw,1.65rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Desktop /about — author + date inside the orange hero box (bottom-right inset). */
export const ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW =
  "pointer-events-none absolute bottom-6 right-6 z-10 text-right md:bottom-8 md:right-8 lg:bottom-10 lg:right-10";

export const ABOUT_DESKTOP_HERO_BYLINE_TW = `font-medium leading-none text-white text-[clamp(0.88rem,0.78vw,1rem)] md:text-[clamp(0.92rem,0.82vw,1.06rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_HERO_DATE_TW = `mt-1 font-medium leading-none text-white/90 text-[clamp(0.82rem,0.74vw,0.94rem)] md:text-[clamp(0.88rem,0.78vw,0.98rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_MAX_W = "max-w-[min(100%,54rem)]";

/** One full-viewport /about desktop band. */
export const ABOUT_DESKTOP_SECTION_H =
  "about-desktop-section box-border h-[100dvh] max-h-[100dvh] min-h-[100dvh] overflow-hidden";

/** Split bands — two equal columns; inner shell clears punched nav. */
export const ABOUT_DESKTOP_SPLIT_SECTION_GRID =
  "about-desktop-section__inner grid h-full min-h-0 w-full grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 px-[var(--desktop-page-inset-x,2.5rem)]";

/** Sections 2–4 — beige panel bleeds to the outer page margin on its side. */
export const ABOUT_DESKTOP_SPLIT_SECTION_GRID_BLEED =
  "about-desktop-section__inner grid h-full min-h-0 w-full grid-cols-2";

/** Shared inner gutter between text and beige panel (sections 2–4 bleed layout). */
export const ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_LEFT =
  "pl-10 md:pl-12 lg:pl-14 xl:pl-16";

export const ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_RIGHT =
  "pr-10 md:pr-12 lg:pr-14 xl:pr-16";

export const ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y = "py-8 md:py-10 lg:py-12";

/** Shared inset for text and beige columns within each split band. */
export const ABOUT_DESKTOP_SPLIT_COLUMN_PAD = "p-6 md:p-8 lg:p-10 xl:p-12";

/** Text column when the beige panel sits on the right. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_LEFT =
  `flex min-h-0 min-w-0 flex-col justify-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** Text column when the beige panel sits on the left. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_RIGHT =
  `flex min-h-0 min-w-0 flex-col justify-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** Text column — bleed layout, beige panel on the right. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_LEFT_BLEED = `flex min-h-0 min-w-0 flex-col justify-center ${DOEPHONE_DESKTOP_PAGE_INSET_LEFT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_RIGHT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y}`;

/** Text column — bleed layout, beige panel on the left. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_RIGHT_BLEED = `flex min-h-0 min-w-0 flex-col justify-center ${DOEPHONE_DESKTOP_PAGE_INSET_RIGHT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_LEFT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y}`;

/** FAQ text column — center accordion to match beige square footprint. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_FAQ =
  `grid min-h-0 min-w-0 h-full place-items-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** FAQ text column — bleed layout beside right-side beige panel. */
export const ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_FAQ_BLEED = `grid min-h-0 min-w-0 h-full place-items-center ${DOEPHONE_DESKTOP_PAGE_INSET_LEFT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_RIGHT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y}`;

/** Beige square column — inset on all four sides within its half of the section. */
export const ABOUT_DESKTOP_SPLIT_BOX_COLUMN =
  `grid min-h-0 min-w-0 h-full place-items-center ${ABOUT_DESKTOP_SPLIT_COLUMN_PAD}`;

/** Beige square column — flush to the right page margin (sections 2 & 4). */
export const ABOUT_DESKTOP_SPLIT_BOX_COLUMN_RIGHT_BLEED = `grid min-h-0 min-w-0 h-full items-center justify-items-end ${DOEPHONE_DESKTOP_PAGE_INSET_RIGHT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_LEFT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y}`;

/** Beige square column — flush to the left page margin (section 3). */
export const ABOUT_DESKTOP_SPLIT_BOX_COLUMN_LEFT_BLEED = `grid min-h-0 min-w-0 h-full items-center justify-items-start ${DOEPHONE_DESKTOP_PAGE_INSET_LEFT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_X_RIGHT} ${ABOUT_DESKTOP_SPLIT_BLEED_INNER_Y}`;

export const ABOUT_DESKTOP_BEIGE_PANEL_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} aspect-square max-h-full max-w-full w-full border border-[var(--doe-page-border,rgba(26,18,8,0.14))] bg-[var(--doe-page-surface-raised,#f5e6d0)]`;

/** FAQ accordion — same max square as the beige panel in the adjacent column. */
export const ABOUT_DESKTOP_SQUARE_PANEL_TW = ABOUT_DESKTOP_BEIGE_PANEL_TW;

export const ABOUT_DESKTOP_FAQ_PANEL_TW = ABOUT_DESKTOP_SQUARE_PANEL_TW;

/** Desktop /about section two — intro + chart aligned to beige square height. */
export const ABOUT_DESKTOP_SECTION_2_STACK = "flex h-full min-h-0 w-full flex-col justify-between";

export const ABOUT_DESKTOP_SECTION_2_CONTENT_GAP = "gap-5 md:gap-6";

/** Desktop /about FAQ tabs — section four accordion beside beige panel. */
export const ABOUT_DESKTOP_FAQ_LIST_TW = "flex h-full min-h-0 w-full flex-col";

export const ABOUT_DESKTOP_FAQ_ITEM_TW = `text-[clamp(1.28rem,1.18vw,1.52rem)] md:text-[clamp(1.4rem,1.28vw,1.68rem)] lg:text-[clamp(1.5rem,1.35vw,1.78rem)] leading-[1.15] tracking-[-0.015em] ${inter.className}`;

export const ABOUT_DESKTOP_FAQ_ANSWER_TW = "pt-2.5 md:pt-3";

export const ABOUT_DESKTOP_FAQ_ANSWER_BODY_TW = `text-[clamp(0.98rem,0.9vw,1.12rem)] md:text-[clamp(1.05rem,0.95vw,1.18rem)] font-normal leading-[1.48] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

export const ABOUT_DESKTOP_CONTENT_STACK_GAP = "gap-8 md:gap-9 lg:gap-10";

export const ABOUT_DESKTOP_STACK_GAP = "gap-12 md:gap-14";

export const ABOUT_DESKTOP_CHART_CITATION_TW = `mt-3 md:mt-4 font-normal leading-snug text-[#BE8660] text-[clamp(0.92rem,0.85vw,1.05rem)] md:text-[clamp(0.98rem,0.9vw,1.1rem)] ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_SECTION_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_HERO_WRAP = "flex min-h-0 w-full flex-col";

export const ABOUT_DESKTOP_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} h-full min-h-0 w-full flex-1`;

export const ABOUT_DESKTOP_ARTICLE_BODY_TW = `text-[clamp(1.12rem,1.05vw,1.32rem)] md:text-[clamp(1.22rem,1.1vw,1.42rem)] font-normal leading-[1.5] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_VISUAL_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_ARTICLE_H2_TW = `text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.55rem,1.35vw,1.95rem)] md:text-[clamp(1.72rem,1.45vw,2.1rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.85rem,1.65vw,2.35rem)] md:text-[clamp(2.05rem,1.85vw,2.65rem)] ${lora.className}`;

export const ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW = `mt-5 md:mt-6 font-medium text-[#BE8660] text-[clamp(1.12rem,1vw,1.32rem)] md:text-[clamp(1.22rem,1.05vw,1.42rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_LIST_GAP = "space-y-3 md:space-y-3.5";

/** iPhone /about — vertical rhythm between major bands. */
export const ABOUT_MOBILE_SECTION_GAP = "space-y-14 iphone-page:space-y-16";

/** iPhone /about — copy blocks (intro, bullets, founder paragraphs). */
export const ABOUT_MOBILE_CONTENT_GAP = "space-y-6 iphone-page:space-y-7";

export const ABOUT_MOBILE_BODY_TW = BLOG_ARTICLE_BODY_TW;

export const ABOUT_MOBILE_LIST_GAP = "space-y-4 iphone-page:space-y-5";

/** iPhone /about beige panel — same footprint as the hero gradient box. */
export const ABOUT_MOBILE_BEIGE_PANEL_TW = `relative w-full overflow-hidden border border-[#D9D4CC] bg-[#EBE7E0] ${ABOUT_PAGE_HERO_BOX_TW}`;

/** iPhone /about FAQ accordion — single column within page margins. */
export const ABOUT_MOBILE_FAQ_LIST_TW = "flex w-full flex-col";

export const ABOUT_MOBILE_FAQ_ITEM_TW = `text-[clamp(1.48rem,1.28rem+0.95vmin,1.82rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.22vmin,2.08rem)] leading-[1.15] tracking-[-0.015em] ${inter.className}`;

export const ABOUT_MOBILE_FAQ_ANSWER_TW = "pb-4 pt-2.5 iphone-page:pb-5 iphone-page:pt-3";

export const ABOUT_MOBILE_FAQ_ANSWER_BODY_TW = BLOG_ARTICLE_BODY_TW;

/** iPhone /about — section headlines (below main mission title). */
export const ABOUT_MOBILE_SECTION_HEADLINE_TW = `text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(2.65rem,9.5vw,4.35rem)] iphone-page:text-[clamp(2.5rem,9vw,4.05rem)] text-[#1E343A] ${suisseIntl.className}`;

/** iPhone /about — enlarged pie chart title. */
export const ABOUT_MOBILE_PIE_CHART_TITLE_TW =
  "text-[clamp(1.32rem,1.12rem+0.95vmin,1.62rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.92rem)]";

export const ABOUT_MOBILE_CHART_JOINT_CAPTION_TW = `mt-4 font-normal leading-snug text-[#BE8660] iphone-page:mt-5 text-[clamp(0.98rem,0.86rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.65vmin,1.2rem)] ${inter.className}`;

export const ABOUT_MOBILE_CHART_CITATION_TW = `mt-3 font-normal leading-snug text-[#BE8660] text-[clamp(0.92rem,0.86rem+0.5vmin,1.05rem)] ${inter.className}`;

export const ABOUT_MOBILE_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.62rem,1.3rem+1.45vmin,2.1rem)] iphone-page:text-[clamp(1.85rem,1.45rem+2vmin,2.6rem)] ${lora.className}`;

export const ABOUT_MOBILE_ARTICLE_QUOTE_ATTRIBUTION_TW = `mt-4 font-medium text-[#BE8660] iphone-page:mt-5 text-[clamp(1.08rem,0.95rem+0.55vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.05rem+0.8vmin,1.48rem)] ${dmSans.className}`;
