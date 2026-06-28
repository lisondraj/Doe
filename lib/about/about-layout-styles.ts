import { DOEPHONE_SECTION_COPY_TW } from "@/lib/doephone/section-styles";
import { inter, suisseIntl } from "@/lib/home/fonts";

/** About page mission headline — matches iPhone main page section titles. */
export const ABOUT_PAGE_TITLE_TW = `${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${suisseIntl.className}`;

/** About subheading — customization-section description style, scaled up. */
export const ABOUT_PAGE_SUBHEADING_TW = `mt-[clamp(0.85rem,0.65rem+0.85vmin,1.25rem)] text-[clamp(1.42rem,1.22rem+0.95vmin,1.78rem)] iphone-page:text-[clamp(1.68rem,1.38rem+1.35vmin,2.12rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

/** About hero — tighter vertical padding around the full-size feature band. */
export const ABOUT_HERO_WRAP =
  "mt-[clamp(0.75rem,0.58rem+0.65vmin,1.05rem)] mb-[clamp(0.85rem,0.68rem+0.75vmin,1.15rem)]";
