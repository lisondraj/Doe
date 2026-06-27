import { inter, suisseIntl } from "@/lib/home/fonts";

const DOEPHONE_NAV_CTA_BASE = `inline-flex shrink-0 items-center justify-center rounded-[10px] bg-black font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 min-h-[3.35rem] py-3 leading-none iphone-page:min-h-[clamp(3.55rem,2.85rem+3.05vmin,4.3rem)] iphone-page:py-[clamp(0.88rem,0.66rem+0.98vmin,1.12rem)] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.86rem)] ${inter.className}`;

/** Nav bar — black rounded-rect, scales up on iPhone. */
export const DOEPHONE_NAV_WAITLIST_CLASS = `${DOEPHONE_NAV_CTA_BASE} px-6 text-[1.0625rem] iphone-page:px-[clamp(1.65rem,1.28rem+1.55vmin,2.05rem)] iphone-page:text-[clamp(1.12rem,0.96rem+0.92vmin,1.3rem)]`;

/** Three-up nav row — same height as waitlist CTA, tighter horizontal padding. */
export const DOEPHONE_NAV_TRIPLE_CTA_CLASS = `${DOEPHONE_NAV_CTA_BASE} px-3.5 text-[1.0625rem] iphone-page:px-[clamp(0.9rem,0.68rem+0.9vmin,1.2rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.82vmin,1.22rem)]`;

/** Nav bar — plain black page links (Join Us / Investors). */
export const DOEPHONE_NAV_PAGE_LINK_CLASS = `inline-flex shrink-0 items-center font-normal text-black no-underline transition-opacity hover:opacity-70 active:opacity-60 text-[1.0625rem] leading-none iphone-page:text-[clamp(1.12rem,0.96rem+0.92vmin,1.3rem)] ${inter.className}`;

/** Join-waitlist row — Team / Investors / Waitlist text links. */
export const DOEPHONE_NAV_JOIN_ROW_LINK_CLASS = `inline-flex shrink-0 items-center font-normal text-black no-underline transition-opacity hover:opacity-70 active:opacity-60 text-[1.1875rem] leading-none iphone-page:text-[clamp(1.32rem,1.1rem+1.08vmin,1.52rem)] ${inter.className}`;

/** Join-waitlist row — middot between page links. */
export const DOEPHONE_NAV_JOIN_ROW_DOT_CLASS = `shrink-0 select-none text-black/35 text-[1.1875rem] leading-none iphone-page:text-[clamp(1.32rem,1.1rem+1.08vmin,1.52rem)] ${inter.className}`;

/** Hero — white rounded-rect under headline, prominent on iPhone. */
export const DOEPHONE_HERO_WAITLIST_CLASS = `doephone-hero-waitlist-cta inline-flex items-center justify-center rounded-[10px] bg-white font-medium text-black transition-opacity hover:opacity-90 active:opacity-80 mt-6 min-h-[3.35rem] px-7 py-3.5 text-lg leading-none iphone-page:mt-[clamp(1.5rem,1.1rem+1.65vmin,2.3rem)] iphone-page:min-h-[clamp(3.5rem,2.85rem+2.95vmin,4.35rem)] iphone-page:px-[clamp(2rem,1.55rem+1.7vmin,2.55rem)] iphone-page:py-[clamp(1rem,0.78rem+1.05vmin,1.32rem)] iphone-page:text-[clamp(1.2rem,1.02rem+0.88vmin,1.38rem)] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.88rem)] ${suisseIntl.className}`;
