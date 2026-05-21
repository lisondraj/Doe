/** Hero + shared layout paddings reused across home sections. */

/** Hero backdrop gradient — matches footer/hero gradient stack. */
export const HERO_BACKDROP_GRADIENT = `
  linear-gradient(152deg, #1a2e34 0%, #243a40 14%, #3d2f28 32%, #6b442f 48%, #a85a34 62%, #d4893f 76%, #e8b04d 88%, #f2cf7a 100%),
  radial-gradient(ellipse 100% 80% at 50% 110%, rgba(231, 169, 68, 0.55) 0%, transparent 58%),
  radial-gradient(ellipse 55% 45% at 12% 18%, rgba(255, 224, 180, 0.22) 0%, transparent 52%),
  radial-gradient(ellipse 50% 40% at 88% 22%, rgba(210, 119, 76, 0.3) 0%, transparent 55%)
`;

/** Same horizontal inset as the fixed nav — hero, headline band, carousel (forced phone layout). */
export const narrowHorizontalInset =
  "iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))]";

/**
 * Vertical bento horizontal inset — applied to scroll container so sticky element
 * inherits the narrowed width (matching carousel gutters).
 * Block (vertical) padding is applied directly on the sticky child, not here.
 */
export const VBENTO_CANVAS_PADDING = "px-4 " + narrowHorizontalInset;

/** Hero body copy — tagline, founders, and CTA share one scale. */
export const HERO_BODY_COPY =
  "text-[clamp(1.38rem,4.65vw,2.15rem)] iphone-page:text-[clamp(1.32rem,5vw,2.05rem)] font-medium text-white/[0.88] tracking-tight leading-[1.22]";
export const HERO_INTRO_REVEAL = "transition-[opacity,transform] duration-[1050ms] ease-out";
