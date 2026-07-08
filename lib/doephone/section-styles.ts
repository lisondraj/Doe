import { inter, suisseIntl } from "@/lib/home/fonts";
import type { CSSProperties } from "react";

/** iPhone horizontal page gutter — nav, hero, sections, and footer share these edges. */
export const DOEPHONE_PHONE_GUTTER_MIN = "1.65rem";
export const DOEPHONE_PHONE_GUTTER_VMIN = "3.8vmin";
export const DOEPHONE_PHONE_GUTTER_MIN_RIGHT = "1.35rem";

const phoneGutterLeft = `max(${DOEPHONE_PHONE_GUTTER_MIN},calc(env(safe-area-inset-left,0px)+${DOEPHONE_PHONE_GUTTER_VMIN}))`;
const phoneGutterRight = `max(${DOEPHONE_PHONE_GUTTER_MIN},calc(env(safe-area-inset-right,0px)+${DOEPHONE_PHONE_GUTTER_VMIN}))`;
const phoneGutterRightAsymmetric = `max(${DOEPHONE_PHONE_GUTTER_MIN_RIGHT},env(safe-area-inset-right,0px))`;

/** Shared gutter token for layout math (join hero height, etc.). */
export const DOEPHONE_PHONE_GUTTER_X = phoneGutterLeft;

/** Nav / subpage absolute logo and CTA edges. */
export const DOEPHONE_PHONE_GUTTER_LOGO_LEFT =
  `left-11 iphone-page:left-[${phoneGutterLeft}]`;

export const DOEPHONE_PHONE_GUTTER_APPLY_RIGHT =
  `right-11 iphone-page:right-[${phoneGutterRight}]`;

export const DOEPHONE_PHONE_GUTTER_NAV_LEFT_PAD =
  `pl-11 iphone-page:pl-[${phoneGutterLeft}]`;

/** Shared horizontal inset for /doephone section copy — matches hero. */
export const DOEPHONE_SECTION_COPY_INSET =
  `pl-11 pr-5 iphone-page:pl-[${phoneGutterLeft}] iphone-page:pr-[${phoneGutterRightAsymmetric}]`;

/** Hero copy — balanced L/R gutters so long career lines do not clip on narrow viewports. */
export const DOEPHONE_HERO_COPY_INSET =
  `px-11 iphone-page:px-[${phoneGutterLeft}] doephone-hero-copy-inset`;

/** Desktop home — shared horizontal gutters (nav, hero headline, Build, legacy bands). */
export const DOEPHONE_DESKTOP_PAGE_INSET_X =
  "px-10 md:px-20 lg:px-28 xl:px-36";

export const DOEPHONE_DESKTOP_PAGE_INSET_LEFT =
  "pl-10 md:pl-20 lg:pl-28 xl:pl-36";

export const DOEPHONE_DESKTOP_PAGE_INSET_RIGHT =
  "pr-10 md:pr-20 lg:pr-28 xl:pr-36";

export const DOEPHONE_DESKTOP_PAGE_MARGIN_X =
  "mx-10 md:mx-20 lg:mx-28 xl:mx-36";

/** Desktop home fixed nav — py-6 bar + text-4xl Doe wordmark row. */
export const DESKTOP_HOME_FIXED_NAV_HEIGHT = "5.5rem";

/** Viewport band below fixed desktop nav — shared desktop section height. */
export const DESKTOP_HOME_BELOW_NAV_HEIGHT = `calc(100dvh - ${DESKTOP_HOME_FIXED_NAV_HEIGHT})`;

/** Desktop home — full-bleed gradient bands (Build, Integrations, Documents). */
export const DESKTOP_HOME_BAND_MIN_H = "min-h-[calc(100dvh-5.5rem)]";
export const DESKTOP_HOME_BAND_H = "min-h-[calc(100dvh-5.5rem)] h-[calc(100dvh-5.5rem)]";

/** Desktop home — rounded panel sections (deployments, reception, billing, cohort watch). */
export const DESKTOP_HOME_PANEL_BAND_H = "min-h-[112vh] h-[112vh]";

/** Full-bleed desktop bands — shared top inset for title (left) and + badge (right). */
export const DESKTOP_FULLSCREEN_SECTION_TOP = "top-10 md:top-14 lg:top-16 xl:top-20";

export const DESKTOP_FULLSCREEN_SECTION_TITLE_PT =
  "pt-10 md:pt-14 lg:pt-16 xl:pt-20";

export const DESKTOP_FULLSCREEN_SECTION_BADGE_INSET =
  `right-10 md:right-20 lg:right-28 xl:right-36 ${DESKTOP_FULLSCREEN_SECTION_TOP}`;

/** Footer copy row — section left inset + matching right gutter (Doe wordmark sits outside). */
export const DOEPHONE_FOOTER_CONTENT_INSET =
  `pl-11 pr-11 iphone-page:pl-[${phoneGutterLeft}] iphone-page:pr-[${phoneGutterRight}]`;

/** Standard content gutter for all sections (same left edge as hero headline). */
export const DOEPHONE_SECTION_CONTENT_INSET = DOEPHONE_SECTION_COPY_INSET;

/** Uniform section gutter — vertical rhythm unchanged; horizontal matches page edge. */
export const DOEPHONE_SECTION_UNIFORM_PAD =
  `py-14 px-11 iphone-page:py-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:px-[${phoneGutterLeft}]`;

/** Carousel band in section 2 — horizontal inset (matches hero left / uniform pad). */
export const DOEPHONE_SECTION_CAROUSEL_INSET_X =
  `px-11 iphone-page:px-[${phoneGutterLeft}] md:px-20 lg:px-28 xl:px-36`;

/** Fixed nav chrome — matches page content edge inside `.doephone-mobile-root`. */
export const DOEPHONE_FIXED_NAV_CONTENT_LEFT =
  `left-[calc(env(safe-area-inset-left,0px)+${phoneGutterLeft})]`;

export const DOEPHONE_FIXED_NAV_CONTENT_RIGHT =
  `right-[calc(env(safe-area-inset-right,0px)+${phoneGutterLeft})]`;

/** Vertical gap — carousel→menu (matches carousel horizontal inset). */
export const DOEPHONE_SECTION_CAROUSEL_MENU_GAP =
  `mt-11 iphone-page:mt-[${phoneGutterLeft}]`;

/** Title→carousel gap — double the carousel→menu inset. */
export const DOEPHONE_SECTION_TITLE_CAROUSEL_GAP =
  `mt-[5.5rem] iphone-page:mt-[max(3.3rem,calc(env(safe-area-inset-left,0px)+7.6vmin))]`;

/** Carousel band in section 2 — equal padding on all sides (matches hero left inset). */
export const DOEPHONE_SECTION_CAROUSEL_UNIFORM_PAD = DOEPHONE_SECTION_UNIFORM_PAD;

/** Top offset for section titles (~52% of prior padding — just under half removed). */
export const DOEPHONE_SECTION_TITLE_PT =
  "pt-[max(1.95rem,calc(env(safe-area-inset-top,0px)+calc(var(--app-vh,100lvh)*0.0725)))]";

/** Section 2 bottom close — mirrors title top padding above Communication. */
export const DOEPHONE_SECTION_TITLE_PB =
  "pb-[max(1.95rem,calc(env(safe-area-inset-bottom,0px)+calc(var(--app-vh,100lvh)*0.0725)))]";

/** Doe brand gradient — menu active rule (warm coral → amber, no dark teal). */
export const DOE_BRAND_GRADIENT_LINE =
  "linear-gradient(90deg, #C47A5A 0%, #D2774C 48%, #D49D4F 100%)";

/** Upper-mid placement for section titles (sections 2+). */
export const DOEPHONE_SECTION_COPY_POSITION =
  `absolute inset-0 z-[3] flex flex-col items-start justify-start ${DOEPHONE_SECTION_TITLE_PT} pb-8`;

/** Suisse display weight — between light (300) and regular (400); hero + carousel menus. */
export const DOEPHONE_DISPLAY_WEIGHT_TW = "font-[350]";

/** Suisse Intl light — between hero and prior section scale. */
export const DOEPHONE_SECTION_COPY_TW =
  "text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(3.05rem,11.75vw,5.15rem)] iphone-page:text-[clamp(2.9rem,11vw,4.85rem)]";

/** Desktop full-bleed gradient bands — scaled above prior desktop band titles. */
export const DESKTOP_FULLSCREEN_SECTION_TITLE_TW =
  "text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(2.65rem,4.05vw,4.05rem)] md:text-[clamp(2.78rem,3.75vw,4.28rem)] lg:text-[clamp(2.92rem,3.5vw,4.52rem)]";

/** iPhone home/about section band — slightly taller than viewport for scroll rhythm. */
export const DOEPHONE_SECTION_BAND_VH = "var(--doe-section-band-vh,var(--app-vh,100lvh))";

/** iPhone home hero — slightly shorter than section bands. */
export const DOEPHONE_HERO_BAND_VH = "var(--doe-hero-band-vh,var(--doe-section-band-vh,var(--app-vh,100lvh)))";

/** Full iPhone viewport band — locked to `--doe-section-band-vh` (stable vs Safari chrome). */
export const DOEPHONE_VIEWPORT_SECTION =
  `relative z-10 w-full min-h-[${DOEPHONE_SECTION_BAND_VH}] h-[${DOEPHONE_SECTION_BAND_VH}] overflow-hidden bg-[#1E343A]`;

/** Beige section shell — at least one stable viewport tall; grows with content. */
export const DOEPHONE_BEIGE_SECTION =
  `relative z-10 flex min-h-[${DOEPHONE_SECTION_BAND_VH}] w-full flex-col bg-[var(--doe-page-surface,#EDE8DF)]`;

/** Main mobile home — min band height clearing iOS home indicator + Safari bottom bar. */
export const DOEPHONE_MAIN_PAGE_SECTION_MIN_H =
  `min-h-[calc(${DOEPHONE_SECTION_BAND_VH}+env(safe-area-inset-bottom,0px)+3.25rem)]`;

/** Main page beige band — grows with content; never clips like a fixed height. */
export const DOEPHONE_MAIN_PAGE_BEIGE_SECTION =
  `relative z-10 flex w-full flex-col bg-[var(--doe-page-surface,#EDE8DF)] ${DOEPHONE_MAIN_PAGE_SECTION_MIN_H}`;

/** Main page dark band — min-height only so inner content is not clipped. */
export const DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION =
  `relative z-10 flex w-full flex-col overflow-hidden bg-[#1E343A] ${DOEPHONE_MAIN_PAGE_SECTION_MIN_H}`;

/** Centers a section's content block vertically without altering its internal layout. */
export const DOEPHONE_SECTION_CONTENT_CENTER =
  "flex min-h-0 flex-1 flex-col justify-center";

/** Section 2 carousel — fixed height; tied to stable viewport, not dynamic svh. */
export const DOEPHONE_SECTION_CAROUSEL_HEIGHT =
  "h-[clamp(46rem,calc(var(--app-vh,100lvh)*1.04),69rem)] min-h-[clamp(46rem,calc(var(--app-vh,100lvh)*1.04),69rem)] max-h-[clamp(46rem,calc(var(--app-vh,100lvh)*1.04),69rem)] shrink-0";

/** Fixed stage — tallest preset layout so menu below does not shift on tab change. */
export const DOEPHONE_BOX_CLUSTER_STAGE_HEIGHT =
  "h-[clamp(36rem,86vmin,50rem)] min-h-[clamp(36rem,86vmin,50rem)] max-h-[clamp(36rem,86vmin,50rem)] shrink-0 iphone-page:h-[clamp(34rem,82vmin,47rem)] iphone-page:min-h-[clamp(34rem,82vmin,47rem)] iphone-page:max-h-[clamp(34rem,82vmin,47rem)]";

/** Rounded corners shared by section 2 carousel cards + embedded backdrop clip. */
export const DOEPHONE_SECTION_CAROUSEL_RADIUS =
  "rounded-[clamp(1.1rem,0.95rem+0.75vmin,1.45rem)]";

/** Matching radius for clip-path — avoids grey square wedges at bottom corners on Safari. */
export const DOEPHONE_SECTION_CAROUSEL_RADIUS_PX =
  "clamp(1.1rem, calc(0.95rem + 0.75vmin), 1.45rem)";

export const DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE: CSSProperties = {
  borderRadius: DOEPHONE_SECTION_CAROUSEL_RADIUS_PX,
  clipPath: `inset(0 round ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX})`,
};

/** Customization section footer carousel — taller than nav default. */
export const DOEPHONE_SECTION_FOOTER_CAROUSEL_HEIGHT =
  "min-h-[clamp(19.5rem,52vmin,29rem)] h-[clamp(19.5rem,52vmin,29rem)] iphone-page:min-h-[clamp(18.25rem,49vmin,27rem)] iphone-page:h-[clamp(18.25rem,49vmin,27rem)]";

/** Below-carousel caption — slightly lighter than nav footer outside copy. */
export const DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW = `text-[1.5rem] iphone-page:text-[clamp(1.38rem,0.88rem+2.3vmin,2.45rem)] font-normal leading-snug tracking-tight text-gray-700 ${inter.className}`;

/** Customization section — preset heading above description below box cluster. */
export const DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW = `text-[clamp(1.72rem,1.42rem+1.2vmin,2.2rem)] iphone-page:text-[clamp(2.05rem,1.68rem+1.75vmin,2.7rem)] font-normal leading-[1.1] tracking-[-0.025em] text-[#1E343A] ${suisseIntl.className}`;

/** Customization section — three-line preset copy below heading. */
export const DOEPHONE_SECTION_MENU_DESCRIPTION_TW = `mt-[clamp(0.55rem,0.42rem+0.6vmin,0.9rem)] text-[clamp(1.18rem,1rem+0.78vmin,1.42rem)] iphone-page:text-[clamp(1.38rem,1.14rem+1.05vmin,1.72rem)] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;
