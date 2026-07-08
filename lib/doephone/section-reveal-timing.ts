/** Section 2 segmented reveal — title → carousel → menu. */

export const DOEPHONE_SECTION_REVEAL_DURATION_MS = 1750;
export const DOEPHONE_SECTION_REVEAL_GAP_MS = 400;

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

/** Agents carousel — orbs → label + chevrons. */
export const DOEPHONE_AGENTS_REVEAL_ORBS_DELAY_MS = 0;
export const DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS = 420;
export const DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS = 560;

/** Hero dial orbs — load-in after headline begins settling. */
export const DOEPHONE_HERO_ORB_REVEAL_BASE_DELAY_MS = 0;
export const DOEPHONE_HERO_ORB_REVEAL_STAGGER_MS = 0;

export function doephoneAgentsRevealStyleVars(): Record<string, string> {
  return {
    "--doephone-section-reveal-duration": `${DOEPHONE_SECTION_REVEAL_DURATION_MS}ms`,
    "--doephone-section-reveal-agents-orbs-delay": `${DOEPHONE_AGENTS_REVEAL_ORBS_DELAY_MS}ms`,
    "--doephone-section-reveal-agents-label-delay": `${DOEPHONE_AGENTS_REVEAL_LABEL_DELAY_MS}ms`,
    "--doephone-section-reveal-agents-nav-delay": `${DOEPHONE_AGENTS_REVEAL_NAV_DELAY_MS}ms`,
  };
}
