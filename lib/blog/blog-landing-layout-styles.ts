import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

import {
  BROADER_DOE_VISION_BYLINE_TW,
  BROADER_DOE_VISION_HERO_HEADLINES_WRAP,
  BROADER_DOE_VISION_HERO_INTRO_WRAP,
  BROADER_DOE_VISION_HERO_WRAP,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_TITLE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";

export {
  BROADER_DOE_VISION_BYLINE_TW,
  BROADER_DOE_VISION_HERO_HEADLINES_WRAP,
  BROADER_DOE_VISION_HERO_INTRO_WRAP,
  BROADER_DOE_VISION_HERO_WRAP,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_TITLE_TW,
};

/** Blog landing hero shader band — reuse article hero spacing. */
export const BLOG_LANDING_HERO_WRAP = BROADER_DOE_VISION_HERO_WRAP;

/** List card shader box — wide thumbnail under each post title block. */
export const BLOG_LANDING_CARD_VISUAL_TW = `blog-landing-card-visual relative aspect-[16/10] w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`;

/** Post category on landing cards — all caps, top-left above title. */
export const BLOG_LANDING_CARD_CATEGORY_TW = `blog-landing-card-category mb-2 font-medium uppercase tracking-[0.1em] ${dmSans.className}`;

/** Post category on article heroes — small centered label above title. */
export const BLOG_ARTICLE_CATEGORY_TW = `blog-article-category mb-3 text-center font-medium tracking-[0.06em] iphone-page:mb-3.5 ${dmSans.className}`;

/** Post title on landing cards — gold gradient, smaller than page hero. */
export const BLOG_LANDING_CARD_TITLE_TW = `blog-landing-card-title font-[375] leading-[1.06] tracking-[-0.03em] ${suisseIntl.className}`;

/** Post subheading on landing cards — matches article hero subheading. */
export const BLOG_LANDING_CARD_SUBHEADING_TW = `${BROADER_DOE_VISION_SUBHEADING_TW} blog-landing-card-subheading mt-2`;

/** Card byline — matches article hero byline. */
export const BLOG_LANDING_CARD_BYLINE_TW = `${BROADER_DOE_VISION_BYLINE_TW} blog-landing-card-byline mt-2`;

/** Card excerpt — muted cream body copy. */
export const BLOG_LANDING_CARD_EXCERPT_TW = `blog-landing-card-excerpt mt-3 font-normal leading-[1.44] tracking-[-0.01em] ${dmSans.className}`;

/** Read-more link on landing cards. */
export const BLOG_LANDING_READ_MORE_TW = `blog-landing-read-more mt-3 inline-flex items-center gap-2 font-medium transition-opacity group-hover:opacity-80 ${dmSans.className}`;

/** Vertical stack inside each landing card link. */
export const BLOG_LANDING_CARD_STACK = "blog-landing-card-stack flex flex-col";

/** Divider between landing list items. */
export const BLOG_LANDING_LIST_DIVIDER_WRAP = "blog-landing-list-divider py-10 iphone-page:py-12";

export const BLOG_LANDING_LIST_DIVIDER_LINE = "blog-landing-list-divider-line h-px w-full";

/** Space between landing hero and first post. */
export const BLOG_LANDING_LIST_TOP_GAP = "mt-10 iphone-page:mt-12";
