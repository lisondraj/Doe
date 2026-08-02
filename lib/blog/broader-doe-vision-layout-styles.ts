import { dmSans, suisseIntl } from "@/lib/home/fonts";

/** iPhone /about — extra clearance below fixed nav + banner. */
export const BROADER_DOE_VISION_CONTENT_PT =
  "pt-[max(12.85rem,calc(env(safe-area-inset-top,0px)+8.95rem))] iphone-page:pt-[max(13.35rem,calc(env(safe-area-inset-top,0px)+9.35rem))]";

/** Hero intro — centered title, subheading, and byline block. */
export const BROADER_DOE_VISION_HERO_INTRO_WRAP = "broader-doe-hero-intro text-center";

export const BROADER_DOE_VISION_HERO_HEADLINES_WRAP = "broader-doe-hero-headlines mx-auto w-full max-w-[min(100%,42rem)]";

/** Broader Doe Vision title — gold gradient applied in CSS; slightly heavier than section default. */
export const BROADER_DOE_VISION_TITLE_TW = `broader-doe-hero-title text-center font-[350] leading-[1.02] tracking-[-0.035em] text-[clamp(3.05rem,11.75vw,5.15rem)] iphone-page:text-[clamp(2.9rem,11vw,4.85rem)] ${suisseIntl.className}`;

/** Hero shader band — extra space above the gradient box. */
export const BROADER_DOE_VISION_HERO_WRAP = "broader-doe-hero-visual mt-10 mb-4 iphone-page:mt-12 iphone-page:mb-5";

/** Broader Doe Vision thesis section — chart-style caption, scaled up. */
export const BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW = `about-chart-figcaption mb-5 font-medium leading-snug tracking-[-0.01em] text-[#F2E8DA] iphone-page:mb-6 text-[clamp(1.32rem,1.12rem+0.95vmin,1.62rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.92rem)] ${dmSans.className}`;

/** Broader Doe Vision subheading — gold gradient applied in CSS. */
export const BROADER_DOE_VISION_SUBHEADING_TW = `broader-doe-hero-description about-page-description m-0 font-medium leading-snug tracking-[-0.01em] text-[clamp(1.42rem,1.22rem+0.95vmin,1.78rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.35vmin,2.12rem)] ${dmSans.className}`;

/** Broader Doe Vision byline — centered under subheading. */
export const BROADER_DOE_VISION_BYLINE_TW = `broader-doe-hero-byline about-page-byline m-0 font-medium text-[#E8C08E] text-[clamp(1.02rem,0.88rem+0.58vmin,1.22rem)] iphone-page:text-[clamp(1.08rem,0.92rem+0.62vmin,1.28rem)] ${dmSans.className}`;

/** Broader Doe Vision article body — muted cream DM Sans at existing article scale. */
export const BROADER_DOE_VISION_BODY_TW = `broader-doe-body text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.95rem)] font-normal leading-[1.48] tracking-[-0.01em] text-[rgba(242,232,218,0.92)] ${dmSans.className}`;

/** Broader Doe Vision thesis list items — bold, same scale as body, gradient applied in CSS. */
export const BROADER_DOE_VISION_THESIS_ITEM_TW = `text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.95rem)] font-normal leading-[1.48] tracking-[-0.01em] ${dmSans.className}`;
