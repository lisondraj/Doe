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
import { inter, suisseIntl } from "@/lib/home/fonts";

/** Horizontal gutters — matches closing section carousel band. */
export const BLOG_PAGE_INSET_X = DOEPHONE_SECTION_CAROUSEL_INSET_X;

/** Space between blog copy and the footer gradient. */
export const BLOG_FOOTER_GAP =
  "pb-[max(3.5rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+3rem))]";

/** Clears fixed iPhone nav above blog content. */
export const BLOG_CONTENT_PT =
  "pt-[max(11.25rem,calc(env(safe-area-inset-top,0px)+7.75rem))]";

/** Large section title — "One provider, one patient at a time." scale. */
export const BLOG_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** Intro / body copy under titles. */
export const BLOG_BODY_COPY_TW = DOEPHONE_SECTION_MENU_DESCRIPTION_TW;

/** Card caption under feature visuals — closing section outside copy. */
export const BLOG_CARD_TITLE_TW = `${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW} text-left text-gray-700`;

/** Landing list card title — slightly larger than footer caption. */
export const BLOG_LANDING_CARD_TITLE_TW = `text-[1.65rem] iphone-page:text-[clamp(1.5rem,0.92rem+2.55vmin,2.65rem)] font-normal leading-snug tracking-tight text-gray-700 ${inter.className}`;

/** Tight gap between landing card title and author/date. */
export const BLOG_LANDING_TITLE_META_GAP = "mt-1 iphone-page:mt-[clamp(0.2rem,0.12rem+0.35vmin,0.35rem)]";

/** Divider between landing list articles — visible rule with padding above and below. */
export const BLOG_LIST_DIVIDER_WRAP =
  "py-10 iphone-page:py-[clamp(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

export const BLOG_LIST_DIVIDER_LINE = "m-0 w-full border-0 border-t border-[#CFC9BF]";

/** Small read-more label on landing cards. */
export const BLOG_READ_MORE_TW = `inline-flex items-center gap-1.5 text-[clamp(0.95rem,0.86rem+0.42vmin,1.08rem)] iphone-page:text-[clamp(1.02rem,0.9rem+0.55vmin,1.14rem)] font-medium text-[#6B7280] transition-colors group-hover:text-[#1E343A] ${suisseIntl.className}`;

/** Author · date line under card/article titles. */
export const BLOG_META_TW = `text-[clamp(1.18rem,1rem+0.78vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.14rem+1.05vmin,1.72rem)] font-medium text-[#6B7280] ${suisseIntl.className}`;

/** Article eyebrow / back link. */
export const BLOG_EYEBROW_TW = `text-[clamp(1.18rem,1rem+0.78vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.14rem+1.05vmin,1.72rem)] font-medium tracking-[0.02em] text-[#6B7280] ${suisseIntl.className}`;

/** Closing-section feature card box. */
export const BLOG_FEATURE_BOX_TW = `${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`;

/** Landing hero graphic box — two-thirds iPhone viewport, deeper beige with inset border. */
export const BLOG_LANDING_HERO_HEIGHT = "h-[66.667dvh] min-h-[66.667dvh]";

export const BLOG_LANDING_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} border border-[#D9D4CC] bg-[#EBE7E0]`;

/** Gap between landing hero and article list. */
export const BLOG_LANDING_HERO_GAP = DOEPHONE_SECTION_CAROUSEL_MENU_GAP;

/** Title → first visual gap (closing section title→carousel). */
export const BLOG_TITLE_VISUAL_GAP = DOEPHONE_SECTION_TITLE_CAROUSEL_GAP;

/** Stacked list / card spacing (closing section card→card). */
export const BLOG_STACK_GAP = DOEPHONE_SECTION_CAROUSEL_MENU_GAP;

/** Visual → caption stack (closing section card→outside copy). */
export const BLOG_CARD_STACK = "space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]";

/** Article body paragraphs — same scale as section menu descriptions. */
export const BLOG_ARTICLE_BODY_TW = `text-[clamp(1.18rem,1rem+0.78vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.14rem+1.05vmin,1.72rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;
