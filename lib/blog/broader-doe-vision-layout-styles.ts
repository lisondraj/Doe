import { dmSans, lora, suisseIntl } from "@/lib/home/fonts";

/** iPhone /about — nav clearance only; band gap lives on `.broader-doe-hero-intro`. */
export const BROADER_DOE_VISION_CONTENT_PT = "";

/** Shared vertical rhythm — nav→title and byline→hero shader (iPhone). */
export const BROADER_DOE_VISION_HERO_BAND_GAP = "mt-12 iphone-page:mt-12";

/** Hero intro — centered title, subheading, and byline block. */
export const BROADER_DOE_VISION_HERO_INTRO_WRAP = `broader-doe-hero-intro text-center ${BROADER_DOE_VISION_HERO_BAND_GAP}`;

export const BROADER_DOE_VISION_HERO_HEADLINES_WRAP = "broader-doe-hero-headlines mx-auto w-full max-w-[min(100%,42rem)]";

/** Product intro blog pages — extra title class for descender clearance + weight. */
export const ABOUT_STYLE_PRODUCT_INTRO_SLUGS = ["introducing-pulse", "introducing-canvas"] as const;

export function isAboutStyleProductIntro(slug: string) {
  return (ABOUT_STYLE_PRODUCT_INTRO_SLUGS as readonly string[]).includes(slug);
}

/** Broader Doe Vision title — gold gradient + size in CSS. */
export const BROADER_DOE_VISION_TITLE_TW = `broader-doe-hero-title text-center font-[375] leading-[1.02] tracking-[-0.035em] ${suisseIntl.className}`;

/** Product intro titles — room for descenders (g, y) under gradient clip. */
export const ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW = "broader-doe-hero-title--product-intro";

/** Hero shader band — space above the gradient box matches nav→title band gap. */
export const BROADER_DOE_VISION_HERO_WRAP = `broader-doe-hero-visual ${BROADER_DOE_VISION_HERO_BAND_GAP} mb-4 iphone-page:mb-5`;

/** Broader Doe Vision thesis section — chart-style caption, scaled up. */
export const BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW = `broader-doe-thesis-headline about-chart-figcaption mb-5 font-medium leading-snug tracking-[-0.01em] text-[#F2E8DA] iphone-page:mb-6 text-[clamp(1.32rem,1.12rem+0.95vmin,1.62rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.92rem)] ${dmSans.className}`;

/** /about — gold gradient on Guiding Beliefs headline only (size unchanged). */
export const BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW = "broader-doe-thesis-headline-gold";

/** Broader Doe Vision subheading — gold gradient + size in CSS. */
export const BROADER_DOE_VISION_SUBHEADING_TW = `broader-doe-hero-description about-page-description m-0 font-medium leading-snug tracking-[-0.01em] ${dmSans.className}`;

/** Broader Doe Vision byline — centered under subheading; size in CSS. */
export const BROADER_DOE_VISION_BYLINE_TW = `broader-doe-hero-byline about-page-byline m-0 font-medium text-[#E8C08E] ${dmSans.className}`;

/** Broader Doe Vision article body — muted cream DM Sans at existing article scale. */
export const BROADER_DOE_VISION_BODY_TW = `broader-doe-body text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.95rem)] font-normal leading-[1.48] tracking-[-0.01em] text-[rgba(242,232,218,0.92)] ${dmSans.className}`;

/** Broader Doe Vision thesis list — numbered gold gradient items with hanging indent. */
export const BROADER_DOE_VISION_THESIS_LIST_TW = "broader-doe-thesis-gradient list-none pl-[1.35em]";

/** Indented pull quote — opens before lead, closes after continuation. */
export const BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP =
  "broader-doe-proposal-quote ml-[clamp(1.35rem,1.05rem+1.35vmin,2.15rem)] max-w-[calc(100%-clamp(1.35rem,1.05rem+1.35vmin,2.15rem))]";

export const BROADER_DOE_VISION_PROPOSAL_QUOTE_TW = `about-page-quote text-left font-normal leading-[1.32] tracking-[-0.02em] text-[clamp(1.28rem,1.08rem+0.95vmin,1.55rem)] iphone-page:text-[clamp(1.42rem,1.18rem+1.1vmin,1.72rem)] ${lora.className}`;

/** Broader Doe Vision thesis list items — same scale as body, gradient applied in CSS. */
export const BROADER_DOE_VISION_THESIS_ITEM_TW = `broader-doe-thesis-item text-[clamp(1.32rem,1.12rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.22vmin,1.95rem)] font-normal leading-[1.48] tracking-[-0.01em] ${dmSans.className}`;
