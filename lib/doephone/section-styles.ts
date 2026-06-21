import { inter } from "@/lib/home/fonts";

/** Shared horizontal inset for /doephone section copy — matches hero. */
export const DOEPHONE_SECTION_COPY_INSET =
  "pl-14 pr-6 iphone-page:pl-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:pr-[max(1.65rem,env(safe-area-inset-right,0px))]";

/** Footer copy row — section left inset + matching right gutter (Doe wordmark sits outside). */
export const DOEPHONE_FOOTER_CONTENT_INSET =
  "pl-14 pr-14 iphone-page:pl-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:pr-[max(2.35rem,calc(env(safe-area-inset-right,0px)+5.25vmin))]";

/** Standard content gutter for all sections (same left edge as hero headline). */
export const DOEPHONE_SECTION_CONTENT_INSET = DOEPHONE_SECTION_COPY_INSET;

/** Uniform section gutter — same value as hero/section left inset on all four sides. */
export const DOEPHONE_SECTION_UNIFORM_PAD =
  "p-14 iphone-page:p-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Carousel band in section 2 — horizontal inset (matches hero left / uniform pad). */
export const DOEPHONE_SECTION_CAROUSEL_INSET_X =
  "px-14 iphone-page:px-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Vertical gap — carousel→menu (matches carousel horizontal inset). */
export const DOEPHONE_SECTION_CAROUSEL_MENU_GAP =
  "mt-14 iphone-page:mt-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]";

/** Title→carousel gap — double the carousel→menu inset. */
export const DOEPHONE_SECTION_TITLE_CAROUSEL_GAP =
  "mt-28 iphone-page:mt-[max(4.7rem,calc(env(safe-area-inset-left,0px)+10.5vmin))]";

/** Carousel band in section 2 — equal padding on all sides (matches hero left inset). */
export const DOEPHONE_SECTION_CAROUSEL_UNIFORM_PAD = DOEPHONE_SECTION_UNIFORM_PAD;

/** Top offset for section titles (~52% of prior padding — just under half removed). */
export const DOEPHONE_SECTION_TITLE_PT =
  "pt-[max(1.95rem,calc(env(safe-area-inset-top,0px)+7.25svh))]";

/** Section 2 bottom close — mirrors title top padding above Communication. */
export const DOEPHONE_SECTION_TITLE_PB =
  "pb-[max(1.95rem,calc(env(safe-area-inset-bottom,0px)+7.25svh))]";

/** Doe brand gradient — menu active rule (warm coral → amber, no dark teal). */
export const DOE_BRAND_GRADIENT_LINE =
  "linear-gradient(90deg, #C47A5A 0%, #D2774C 48%, #D49D4F 100%)";

/** Upper-mid placement for section titles (sections 2+). */
export const DOEPHONE_SECTION_COPY_POSITION =
  `absolute inset-0 z-[3] flex flex-col items-start justify-start ${DOEPHONE_SECTION_TITLE_PT} pb-8`;

/** Suisse Intl light — between hero and prior section scale. */
export const DOEPHONE_SECTION_COPY_TW =
  "text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(3.05rem,11.75vw,5.15rem)] iphone-page:text-[clamp(2.9rem,11vw,4.85rem)]";

/** Full iPhone viewport band below hero. */
export const DOEPHONE_VIEWPORT_SECTION =
  "relative z-10 w-full min-h-[100svh] h-[100svh] iphone-page:min-h-[100dvh] iphone-page:h-[100dvh]";

/** Section 2 carousel — fixed height so mobile scroll / dvh changes do not shrink the card. */
export const DOEPHONE_SECTION_CAROUSEL_HEIGHT =
  "h-[clamp(46rem,104svh,69rem)] min-h-[clamp(46rem,104svh,69rem)] max-h-[clamp(46rem,104svh,69rem)] shrink-0";

/** Fixed stage — tallest preset layout so menu below does not shift on tab change. */
export const DOEPHONE_BOX_CLUSTER_STAGE_HEIGHT =
  "h-[clamp(34rem,80vmin,46rem)] min-h-[clamp(34rem,80vmin,46rem)] max-h-[clamp(34rem,80vmin,46rem)] shrink-0 iphone-page:h-[clamp(32rem,76vmin,44rem)] iphone-page:min-h-[clamp(32rem,76vmin,44rem)] iphone-page:max-h-[clamp(32rem,76vmin,44rem)]";

/** Rounded corners shared by section 2 carousel cards + embedded backdrop clip. */
export const DOEPHONE_SECTION_CAROUSEL_RADIUS =
  "rounded-[clamp(1.1rem,0.95rem+0.75vmin,1.45rem)]";

/** Customization section footer carousel — taller than nav default. */
export const DOEPHONE_SECTION_FOOTER_CAROUSEL_HEIGHT =
  "min-h-[clamp(19.5rem,52vmin,29rem)] h-[clamp(19.5rem,52vmin,29rem)] iphone-page:min-h-[clamp(18.25rem,49vmin,27rem)] iphone-page:h-[clamp(18.25rem,49vmin,27rem)]";

/** Below-carousel caption — slightly lighter than nav footer outside copy. */
export const DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW = `text-[1.5rem] iphone-page:text-[clamp(1.38rem,0.88rem+2.3vmin,2.45rem)] font-normal leading-snug tracking-tight text-gray-700 ${inter.className}`;
