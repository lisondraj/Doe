import { inter, suisseIntl } from "@/lib/home/fonts";

/** Nav bar — black pill, taller than the hamburger icon. */
export const DOEPHONE_NAV_WAITLIST_CLASS = `inline-flex shrink-0 items-center justify-center rounded-full bg-black font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 min-h-[clamp(2.45rem,2.05rem+1.95vmin,3rem)] px-[clamp(1rem,0.78rem+1vmin,1.2rem)] py-[clamp(0.5rem,0.38rem+0.55vmin,0.68rem)] text-[clamp(0.78rem,0.66rem+0.52vmin,0.9rem)] leading-none ${inter.className}`;

/** Hero — white pill under headline, scales with viewport. */
export const DOEPHONE_HERO_WAITLIST_CLASS = `doephone-hero-waitlist-cta inline-flex items-center justify-center rounded-full bg-white font-medium text-black transition-opacity hover:opacity-90 active:opacity-80 mt-[clamp(1.35rem,1rem+1.55vmin,2.05rem)] px-[clamp(1.4rem,1.1rem+1.15vmin,1.85rem)] py-[clamp(0.72rem,0.55rem+0.7vmin,0.98rem)] text-[clamp(0.95rem,0.84rem+0.52vmin,1.08rem)] leading-none ${suisseIntl.className}`;
