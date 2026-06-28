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
