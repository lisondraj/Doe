/** Section 2 segmented reveal — title → carousel → menu. */

import type { DoePhoneVariant } from "@/lib/doephone/resolve-doe-phone-variant";

export const DOEPHONE_SECTION_REVEAL_DURATION_MS = 1750;
export const DOEPHONE_SECTION_REVEAL_GAP_MS = 400;

/** iPhone home — preserved pre-desktop-refactor cadence. */
export const DOEPHONE_HOME_SCROLL_REVEAL_DURATION_MS = 2150;
export const DOEPHONE_HOME_SCROLL_REVEAL_GAP_MS = 460;
export const DOEPHONE_HOME_SCROLL_REVEAL_HOVER_MS = 400;

/** Desktop home — downstream scroll reveal polish. */
export const DOEPHONE_HOME_SCROLL_REVEAL_DURATION_MS_DESKTOP = 1520;
export const DOEPHONE_HOME_SCROLL_REVEAL_GAP_MS_DESKTOP = 120;
export const DOEPHONE_HOME_SCROLL_REVEAL_HOVER_MS_DESKTOP = 320;

export const DOEPHONE_SECTION_REVEAL_TITLE_DELAY_MS = 0;
export const DOEPHONE_SECTION_REVEAL_CAROUSEL_DELAY_MS = 700;

export const DOEPHONE_SECTION_REVEAL_MENU_DELAY_MS =
  DOEPHONE_SECTION_REVEAL_CAROUSEL_DELAY_MS +
  DOEPHONE_SECTION_REVEAL_DURATION_MS +
  DOEPHONE_SECTION_REVEAL_GAP_MS;

/** Build section — + badge follows title on the same cadence as carousel. */
export const DOEPHONE_SECTION_REVEAL_BADGE_DELAY_MS = DOEPHONE_SECTION_REVEAL_CAROUSEL_DELAY_MS;

/** Build section — workflow input follows badge on the same cadence as menu. */
export const DOEPHONE_SECTION_REVEAL_INPUT_DELAY_MS = DOEPHONE_SECTION_REVEAL_MENU_DELAY_MS;

/** Desktop Build — workflow input appears one reveal gap after the + badge. */
export const DOEPHONE_DESKTOP_BUILD_INPUT_DELAY_MS =
  DOEPHONE_SECTION_REVEAL_BADGE_DELAY_MS + DOEPHONE_SECTION_REVEAL_GAP_MS;

function homeScrollRevealConfig(variant: DoePhoneVariant) {
  if (variant === "desktop") {
    return {
      duration: DOEPHONE_HOME_SCROLL_REVEAL_DURATION_MS_DESKTOP,
      gap: DOEPHONE_HOME_SCROLL_REVEAL_GAP_MS_DESKTOP,
      hover: DOEPHONE_HOME_SCROLL_REVEAL_HOVER_MS_DESKTOP,
      labelDelay: DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS_DESKTOP,
      navDelay: DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS_DESKTOP,
    };
  }

  return {
    duration: DOEPHONE_HOME_SCROLL_REVEAL_DURATION_MS,
    gap: DOEPHONE_HOME_SCROLL_REVEAL_GAP_MS,
    hover: DOEPHONE_HOME_SCROLL_REVEAL_HOVER_MS,
    labelDelay: DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS,
    navDelay: DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS,
  };
}

export function doephoneSectionRevealStyleVars(): Record<string, string> {
  return {
    "--doephone-section-reveal-duration": `${DOEPHONE_SECTION_REVEAL_DURATION_MS}ms`,
    "--doephone-section-reveal-title-delay": `${DOEPHONE_SECTION_REVEAL_TITLE_DELAY_MS}ms`,
    "--doephone-section-reveal-carousel-delay": `${DOEPHONE_SECTION_REVEAL_CAROUSEL_DELAY_MS}ms`,
    "--doephone-section-reveal-menu-delay": `${DOEPHONE_SECTION_REVEAL_MENU_DELAY_MS}ms`,
    "--doephone-section-reveal-badge-delay": `${DOEPHONE_SECTION_REVEAL_BADGE_DELAY_MS}ms`,
    "--doephone-section-reveal-input-delay": `${DOEPHONE_SECTION_REVEAL_INPUT_DELAY_MS}ms`,
  };
}

export function doephoneHomeScrollRevealStyleVars(
  variant: DoePhoneVariant = "phone",
): Record<string, string> {
  const config = homeScrollRevealConfig(variant);

  return {
    "--doephone-section-reveal-duration": `${config.duration}ms`,
    "--doephone-scroll-reveal-lift-duration": `${config.duration}ms`,
    "--doephone-scroll-reveal-hover-duration": `${config.hover}ms`,
    "--doephone-section-reveal-title-delay": "0ms",
    "--doephone-section-reveal-carousel-delay": `${config.gap}ms`,
    "--doephone-section-reveal-menu-delay": `${config.gap * 2}ms`,
  };
}

/** Agents carousel — focused orb peek unblur on scroll. */
export const DOEPHONE_AGENTS_REVEAL_PEEK_DELAY_MS = 280;

/** Agents carousel — orbs → label + chevrons. */
export const DOEPHONE_AGENTS_REVEAL_CAROUSEL_DELAY_MS = 0;
export const DOEPHONE_AGENTS_REVEAL_ORBS_DELAY_MS = 0;
export const DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS = 540;
export const DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS = 1040;
export const DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS_DESKTOP = 280;
export const DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS_DESKTOP = 520;

/** Hero dial orbs — load-in after headline begins settling. */
export const DOEPHONE_HERO_ORB_REVEAL_BASE_DELAY_MS = 720;
export const DOEPHONE_HERO_ORB_REVEAL_STAGGER_MS = 0;

export function doephoneAgentsRevealStyleVars(
  variant: DoePhoneVariant = "phone",
): Record<string, string> {
  const config = homeScrollRevealConfig(variant);

  return {
    "--doephone-section-reveal-duration": `${config.duration}ms`,
    "--doephone-scroll-reveal-lift-duration": `${config.duration}ms`,
    "--doephone-scroll-reveal-hover-duration": `${config.hover}ms`,
    "--doephone-section-reveal-agents-carousel-delay": `${DOEPHONE_AGENTS_REVEAL_CAROUSEL_DELAY_MS}ms`,
    "--doephone-section-reveal-agents-peek-delay": `${DOEPHONE_AGENTS_REVEAL_PEEK_DELAY_MS}ms`,
    "--doephone-section-reveal-agents-orbs-delay": `${DOEPHONE_AGENTS_REVEAL_ORBS_DELAY_MS}ms`,
    "--doephone-section-reveal-agents-label-delay": `${config.labelDelay}ms`,
    "--doephone-section-reveal-agents-nav-delay": `${config.navDelay}ms`,
  };
}

export function doephoneHomeSectionRevealObserverOptions(variant: DoePhoneVariant) {
  return variant === "desktop"
    ? { threshold: 0.14, rootMargin: "0px 0px 12% 0px" }
    : { threshold: 0.18, rootMargin: "0px 0px 8% 0px" };
}
