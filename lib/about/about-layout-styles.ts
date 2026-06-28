import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_COPY_TW,
} from "@/lib/doephone/section-styles";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

/** About page mission headline — matches iPhone main page section titles. */
export const ABOUT_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** About subheading — customization-section description style, scaled up. */
export const ABOUT_PAGE_SUBHEADING_TW = `mt-[clamp(0.85rem,0.65rem+0.85vmin,1.25rem)] text-[clamp(1.42rem,1.22rem+0.95vmin,1.78rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.35vmin,2.12rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** About hero — article section spacing after subheading and before body copy. */
export const ABOUT_PAGE_HERO_AFTER_SUBHEADING = "mt-10 iphone-page:mt-12";

export const ABOUT_PAGE_HERO_BEFORE_ARTICLE = "mb-10 iphone-page:mb-12";

export const ABOUT_PAGE_HERO_WRAP = `${ABOUT_PAGE_HERO_AFTER_SUBHEADING} ${ABOUT_PAGE_HERO_BEFORE_ARTICLE}`;

/** Desktop /about — same horizontal gutters as desktop home. */
export const ABOUT_DESKTOP_PAGE_INSET = DOEPHONE_DESKTOP_PAGE_INSET_X;

export const ABOUT_DESKTOP_MAIN_PT = "pt-[5.5rem]";

export const ABOUT_DESKTOP_TITLE_TW = `text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(3.35rem,4.8vw,5.35rem)] md:text-[clamp(3.65rem,4.2vw,5.65rem)] lg:text-[clamp(3.85rem,3.85vw,5.85rem)] text-[#1E343A] ${suisseIntl.className}`;

export const ABOUT_DESKTOP_SUBHEADING_TW = `mt-6 md:mt-8 text-[clamp(1.55rem,1.35vw,1.95rem)] md:text-[clamp(1.72rem,1.55vw,2.2rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_MAX_W = "max-w-[min(100%,54rem)]";

export const ABOUT_DESKTOP_ARTICLE_SECTION_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_HERO_AFTER_SUBHEADING = ABOUT_DESKTOP_ARTICLE_SECTION_GAP;

export const ABOUT_DESKTOP_HERO_BEFORE_ARTICLE = "mb-12 md:mb-14";

export const ABOUT_DESKTOP_HERO_WRAP = `${ABOUT_DESKTOP_HERO_AFTER_SUBHEADING} ${ABOUT_DESKTOP_HERO_BEFORE_ARTICLE}`;

export const ABOUT_DESKTOP_HERO_BOX_TW = `${DOEPHONE_SECTION_CAROUSEL_RADIUS} min-h-[clamp(28rem,42vw,38rem)] h-[clamp(28rem,42vw,38rem)]`;

export const ABOUT_DESKTOP_ARTICLE_BODY_TW = `text-[clamp(1.12rem,1.05vw,1.32rem)] md:text-[clamp(1.22rem,1.1vw,1.42rem)] font-normal leading-[1.5] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

export const ABOUT_DESKTOP_ARTICLE_VISUAL_GAP = "mt-12 md:mt-14";

export const ABOUT_DESKTOP_ARTICLE_H2_TW = `text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.55rem,1.35vw,1.95rem)] md:text-[clamp(1.72rem,1.45vw,2.1rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_QUOTE_TW = `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.85rem,1.65vw,2.35rem)] md:text-[clamp(2.05rem,1.85vw,2.65rem)] ${lora.className}`;

export const ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW = `mt-5 md:mt-6 font-medium text-[#9A8F82] text-[clamp(1.12rem,1vw,1.32rem)] md:text-[clamp(1.22rem,1.05vw,1.42rem)] ${dmSans.className}`;

export const ABOUT_DESKTOP_ARTICLE_LIST_GAP = "space-y-3 md:space-y-3.5";
