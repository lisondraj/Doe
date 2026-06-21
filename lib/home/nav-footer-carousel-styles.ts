import { suisseIntl } from "@/lib/home/fonts";

/** Inner padding of nav footer gradient cards — outside copy uses the same left inset. */
export const NAV_FOOTER_CARD_INSET =
  "p-8 iphone-page:p-[clamp(1.35rem,0.9rem+3.1vmin,3.5rem)]";

export const NAV_FOOTER_OUTSIDE_INSET =
  "pl-8 iphone-page:pl-[clamp(1.35rem,0.9rem+3.1vmin,3.5rem)]";

/** Matches /doephone section title weight (Suisse Intl Light). */
export const NAV_FOOTER_BOX_TITLE_TW = `text-[3.25rem] iphone-page:text-[clamp(2.05rem,1rem+5.5vmin,4.65rem)] font-light leading-[1.02] tracking-[-0.03em] ${suisseIntl.className}`;

export const NAV_FOOTER_OUTSIDE_TITLE_TW = `text-[1.5rem] iphone-page:text-[clamp(1.38rem,0.88rem+2.3vmin,2.45rem)] font-light leading-snug tracking-[-0.03em] text-gray-800 ${suisseIntl.className}`;

export const NAV_FOOTER_DATE_TW = `mt-1.5 text-[1.0625rem] iphone-page:text-[clamp(0.98rem,0.78rem+1.15vmin,1.45rem)] font-light tracking-[-0.03em] text-gray-500 ${suisseIntl.className}`;
