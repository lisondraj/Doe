import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_COPY_TW,
  DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW,
  DOEPHONE_SECTION_MENU_DESCRIPTION_TW,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
} from "@/lib/doephone/section-styles";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

/** Horizontal gutters — matches closing section carousel band. */
export const BLOG_PAGE_INSET_X = DOEPHONE_SECTION_CAROUSEL_INSET_X;

/** Space between blog copy and the footer gradient. */
export const BLOG_FOOTER_GAP =
  "pb-[max(3.5rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+3rem))]";

/** Clears fixed iPhone nav above blog content. */
export const BLOG_CONTENT_PT =
  "pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))]";

/** Large section title — used on landing page (Suisse Intl, left-aligned). */
export const BLOG_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** Article page title — Lora, centered. */
export const BLOG_ARTICLE_TITLE_TW = `text-center font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[clamp(2.85rem,10.5vw,4.65rem)] ${lora.className}`;

/** Intro / body copy under titles. */
export const BLOG_BODY_COPY_TW = DOEPHONE_SECTION_MENU_DESCRIPTION_TW;

/** Landing card excerpt — slightly larger than body copy for readability at card scale. */
export const BLOG_LANDING_EXCERPT_TW = `text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.52rem,1.26rem+1.18vmin,1.92rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** Card caption under feature visuals — closing section outside copy. */
export const BLOG_CARD_TITLE_TW = `${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW} text-left text-gray-700`;

/** Landing list card title — DM Sans, close to Inter/Suisse with full weight range. */
export const BLOG_LANDING_CARD_TITLE_TW = `text-[2rem] iphone-page:text-[clamp(1.85rem,1.12rem+3.1vmin,3.05rem)] font-normal leading-snug tracking-tight text-gray-700 ${dmSans.className}`;

/** Tight gap between landing card title and author/date. */
export const BLOG_LANDING_TITLE_META_GAP = "mt-1 iphone-page:mt-[clamp(0.2rem,0.12rem+0.35vmin,0.35rem)]";

/** Divider between landing list articles — padding above and below the rule. */
export const BLOG_LIST_DIVIDER_WRAP = "py-12 iphone-page:py-14";

/** Divider line — explicit div so border fallbacks can't hide it. */
export const BLOG_LIST_DIVIDER_LINE = "h-px w-full bg-[#9A8F82]";

/** Read-more label on landing cards. */
export const BLOG_READ_MORE_TW = `inline-flex items-center gap-2 text-[clamp(1.22rem,1.08rem+0.65vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.18rem+0.95vmin,1.68rem)] font-medium text-[#6B7280] transition-colors group-hover:text-[#1E343A] ${dmSans.className}`;

/** Author · date line under card/article titles. */
export const BLOG_META_TW = `text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.52rem,1.26rem+1.18vmin,1.92rem)] font-medium text-[#6B7280] ${dmSans.className}`;

/** Article eyebrow / back link. */
export const BLOG_EYEBROW_TW = `text-[clamp(1.18rem,1rem+0.78vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.14rem+1.05vmin,1.72rem)] font-medium tracking-[0.02em] text-[#6B7280] ${dmSans.className}`;

/** Closing-section feature card box. */
export const BLOG_FEATURE_BOX_TW = `${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`;

/** Landing hero graphic box — two-thirds stable viewport height (svh never changes on scroll). */
export const BLOG_LANDING_HERO_HEIGHT = "h-[66.667svh] min-h-[66.667svh]";

export const BLOG_LANDING_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} border border-[#D9D4CC] bg-[#EBE7E0]`;

/** Shared bottom padding/inset for the hero footer row (headline + filters). */
export const BLOG_LANDING_HERO_CORNER_PAD =
  "px-8 pb-8 iphone-page:px-[clamp(2rem,1.65rem+1.45vmin,2.6rem)] iphone-page:pb-[clamp(2rem,1.65rem+1.45vmin,2.6rem)]";

/** Bottom row — flex keeps headline and filters in separate columns (no overlap). */
export const BLOG_LANDING_HERO_FOOTER_TW = `absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 iphone-page:gap-4 ${BLOG_LANDING_HERO_CORNER_PAD}`;

/** Lora headline — lives inside the flex footer; min-w-0 so text wraps within its column. */
export const BLOG_LANDING_HERO_HEADLINE_TW = `blog-landing-hero-headline min-w-0 flex-1 pt-0 text-left font-normal leading-[1.06] tracking-[-0.03em] text-[#1E343A] text-[clamp(2.2rem,8vw,3.5rem)] iphone-page:text-[clamp(2.45rem,1.85rem+3.5vmin,4.3rem)] ${lora.className}`;

/** Gap between landing hero and article list. */
export const BLOG_LANDING_HERO_GAP = DOEPHONE_SECTION_CAROUSEL_MENU_GAP;

/** Title → first visual gap (closing section title→carousel). */
export const BLOG_TITLE_VISUAL_GAP = DOEPHONE_SECTION_TITLE_CAROUSEL_GAP;

/** Stacked list / card spacing (closing section card→card). */
export const BLOG_STACK_GAP = DOEPHONE_SECTION_CAROUSEL_MENU_GAP;

/** Visual → caption stack (closing section card→outside copy). */
export const BLOG_CARD_STACK = "space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]";

/** Article body paragraphs. */
export const BLOG_ARTICLE_BODY_TW = `text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.95rem)] font-normal leading-[1.48] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;
