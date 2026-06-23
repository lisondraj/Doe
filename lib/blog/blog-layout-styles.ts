import {
  BLOG_ARTICLE_H2_TW,
  BLOG_ARTICLE_QUOTE_ATTR_TW,
  BLOG_ARTICLE_QUOTE_TW,
  BLOG_CONTENT_PT_REM,
  BLOG_FEATURE_BOX_HEIGHT,
  BLOG_FOOTER_GAP_REM,
  BLOG_LANDING_HERO_GAP,
  BLOG_LIST_SECTION_GAP,
  BLOG_PAGE_INSET_X_REM,
  BLOG_SECTION_GAP,
  BLOG_STACK_GAP,
  BLOG_TITLE_VISUAL_GAP,
} from "@/lib/blog/blog-chrome-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS, DOEPHONE_SECTION_COPY_TW } from "@/lib/doephone/section-styles";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

export {
  BLOG_ARTICLE_H2_TW,
  BLOG_ARTICLE_QUOTE_ATTR_TW,
  BLOG_ARTICLE_QUOTE_TW,
  BLOG_LANDING_HERO_GAP,
  BLOG_LIST_SECTION_GAP,
  BLOG_SECTION_GAP,
  BLOG_STACK_GAP,
  BLOG_TITLE_VISUAL_GAP,
};

/** Horizontal gutters — rem-only so html font-size scaling applies in in-app WebViews. */
export const BLOG_PAGE_INSET_X = BLOG_PAGE_INSET_X_REM;

/** Space between blog copy and the footer gradient. */
export const BLOG_FOOTER_GAP = BLOG_FOOTER_GAP_REM;

/** Clears fixed iPhone nav above blog content. */
export const BLOG_CONTENT_PT = BLOG_CONTENT_PT_REM;

/** Large section title — used on landing page (Suisse Intl, left-aligned). */
export const BLOG_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** Article page title — Lora, centered. */
export const BLOG_ARTICLE_TITLE_TW = `text-center font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[2.85rem] iphone-page:text-[3.65rem] ${lora.className}`;

/** Intro / body copy under titles — rem-only. */
export const BLOG_BODY_COPY_TW = `mt-2 text-[1.28rem] iphone-page:text-[1.55rem] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Landing card excerpt — scales with blog zoom surface. */
export const BLOG_LANDING_EXCERPT_TW = `text-[1.32rem] iphone-page:text-[1.52rem] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Card caption under feature visuals — rem-only. */
export const BLOG_CARD_TITLE_TW = `text-[1.5rem] iphone-page:text-[2.05rem] font-normal leading-snug tracking-tight text-gray-700 text-left ${inter.className}`;

/** Landing list card title — DM Sans, scales with blog root rem. */
export const BLOG_LANDING_CARD_TITLE_TW = `text-[1.85rem] iphone-page:text-[2.05rem] font-normal leading-snug tracking-tight text-gray-700 ${dmSans.className}`;

/** Tight gap between landing card title and author/date. */
export const BLOG_LANDING_TITLE_META_GAP = "mt-1 iphone-page:mt-1";

/** Divider between landing list articles — padding above and below the rule. */
export const BLOG_LIST_DIVIDER_WRAP = "py-12 iphone-page:py-14";

/** Divider line — explicit div so border fallbacks can't hide it. */
export const BLOG_LIST_DIVIDER_LINE = "h-px w-full bg-[#9A8F82]";

/** Read-more label on landing cards. */
export const BLOG_READ_MORE_TW = `inline-flex items-center gap-2 text-[1.22rem] iphone-page:text-[1.38rem] font-medium text-[#6B7280] transition-colors group-hover:text-[#1E343A] ${dmSans.className}`;

/** Author · date line under card/article titles. */
export const BLOG_META_TW = `text-[1.32rem] iphone-page:text-[1.52rem] font-medium text-[#6B7280] ${dmSans.className}`;

/** Article eyebrow / back link. */
export const BLOG_EYEBROW_TW = `text-[1.18rem] iphone-page:text-[1.38rem] font-medium tracking-[0.02em] text-[#6B7280] ${dmSans.className}`;

/** Feature card box — rem height + radius. */
export const BLOG_FEATURE_BOX_TW = `${BLOG_FEATURE_BOX_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`;

/** Landing hero graphic box — two-thirds stable viewport height (svh never changes on scroll). */
export const BLOG_LANDING_HERO_HEIGHT = "h-[66.667svh] min-h-[66.667svh]";

export const BLOG_LANDING_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} border border-[#D9D4CC] bg-[#EBE7E0]`;

/** Container for hero inline-size queries (stack footer when tight). */
export const BLOG_LANDING_HERO_CONTAINER_TW = "blog-landing-hero @container/hero [container-type:inline-size]";

/** Shared bottom padding/inset for the hero footer row (headline + filters). */
export const BLOG_LANDING_HERO_CORNER_PAD =
  "px-8 pb-8 iphone-page:px-[2.35rem] iphone-page:pb-[2.35rem]";

/** Bottom row — CSS grid keeps headline and filters in separate columns. */
export const BLOG_LANDING_HERO_FOOTER_TW = `blog-landing-hero-footer absolute inset-x-0 bottom-0 z-[2] iphone-page:gap-4 ${BLOG_LANDING_HERO_CORNER_PAD}`;

/** Lora headline — rem-only base size; JS fit shrinks to grid cell width. */
export const BLOG_LANDING_HERO_HEADLINE_TW = `blog-landing-hero-headline min-w-0 overflow-hidden pt-0 text-left font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[2.2rem] iphone-page:text-[2.85rem] ${lora.className}`;

/** Visual → caption stack (closing section card→outside copy). */
export const BLOG_CARD_STACK = "space-y-3 iphone-page:space-y-4";

/** Article body paragraphs. */
export const BLOG_ARTICLE_BODY_TW = `text-[1.32rem] iphone-page:text-[1.55rem] font-normal leading-[1.48] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;
