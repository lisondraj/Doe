import {
  DESKTOP_HOME_SECTION_PAD_Y,
  DOEPHONE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/section-styles";

/** Desktop feature band — full viewport; nav overlays top clearance. */
export const DOE_DESKTOP_FEATURE_BAND_H = "min-h-[100dvh] h-[100dvh] max-h-[100dvh]";

/** Equal visual vertical pad (nav clearance applied separately on the section). */
export const DOE_DESKTOP_FEATURE_SECTION_PAD = DESKTOP_HOME_SECTION_PAD_Y;

export const DOE_DESKTOP_FEATURE_COPY_PT = "pt-8 md:pt-10 lg:pt-12";

export const DOE_DESKTOP_FEATURE_TITLE_TW =
  "text-left font-[350] leading-[1.02] tracking-[-0.03em] text-[#1E343A] text-[clamp(2.65rem,4.05vw,4.05rem)] md:text-[clamp(2.78rem,3.75vw,4.28rem)] lg:text-[clamp(2.92rem,3.5vw,4.52rem)]";

export const DOE_DESKTOP_FEATURE_DESC_TW =
  "mt-5 max-w-[42rem] text-[clamp(1.05rem,0.95rem+0.35vw,1.28rem)] md:text-[clamp(1.12rem,1rem+0.4vw,1.38rem)] font-normal leading-[1.52] tracking-[-0.012em] text-[#1E343A]/70";

export const DOE_DESKTOP_PAGE_INSET_X = DOEPHONE_DESKTOP_PAGE_INSET_X;

export const DOE_DESKTOP_NAV_LOGO_TW =
  "text-4xl font-normal leading-none no-underline transition-[color,opacity] duration-300 hover:opacity-90";
