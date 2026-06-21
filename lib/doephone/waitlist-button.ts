import { inter, suisseIntl } from "@/lib/home/fonts";

/** Nav bar — black rounded-rect, scales up on iPhone above the hamburger icon. */
export const DOEPHONE_NAV_WAITLIST_CLASS = `inline-flex shrink-0 items-center justify-center rounded-[10px] bg-black font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 min-h-[3rem] px-5 py-2.5 text-[0.9375rem] leading-none iphone-page:min-h-[clamp(3.2rem,2.6rem+2.75vmin,3.85rem)] iphone-page:px-[clamp(1.45rem,1.12rem+1.35vmin,1.8rem)] iphone-page:py-[clamp(0.78rem,0.58rem+0.85vmin,1rem)] iphone-page:text-[clamp(1.02rem,0.88rem+0.8vmin,1.16rem)] iphone-page:rounded-[clamp(0.62rem,0.5rem+0.42vmin,0.78rem)] ${inter.className}`;

/** Hero — white rounded-rect under headline, prominent on iPhone. */
export const DOEPHONE_HERO_WAITLIST_CLASS = `doephone-hero-waitlist-cta inline-flex items-center justify-center rounded-[10px] bg-white font-medium text-black transition-opacity hover:opacity-90 active:opacity-80 mt-6 min-h-[3rem] px-6 py-3 text-base leading-none iphone-page:mt-[clamp(1.5rem,1.1rem+1.65vmin,2.3rem)] iphone-page:min-h-[clamp(3.15rem,2.6rem+2.55vmin,3.9rem)] iphone-page:px-[clamp(1.8rem,1.4rem+1.5vmin,2.3rem)] iphone-page:py-[clamp(0.88rem,0.68rem+0.95vmin,1.18rem)] iphone-page:text-[clamp(1.1rem,0.96rem+0.75vmin,1.24rem)] iphone-page:rounded-[clamp(0.62rem,0.5rem+0.42vmin,0.8rem)] ${suisseIntl.className}`;
