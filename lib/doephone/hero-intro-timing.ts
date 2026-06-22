/** Hero load sequence — gradient zoom in → polar build → headline. */

/** Gradient starts as a tight glow (20 % of final size) and expands to fill the viewport. */
export const DOEPHONE_HERO_INTRO_GRADIENT_START = 0.20;
export const DOEPHONE_HERO_INTRO_GRADIENT_MS = 1200;

/** Polar radials begin once the gradient zoom is fully settled. */
export const DOEPHONE_HERO_INTRO_POLAR_START_MS = 1250;
export const DOEPHONE_HERO_INTRO_RADIAL_MS = 1350;
export const DOEPHONE_HERO_INTRO_RING_MS = 820;
export const DOEPHONE_HERO_INTRO_RING_STAGGER_MS = 180;
export const DOEPHONE_HERO_INTRO_RING_COUNT = 3;

const HEADLINE_PAD_MS = 90;
const HEADLINE_LINE_GAP_MS = 480;
const HEADLINE_TO_CTA_MS = 1100;

export function doephoneHeroIntroRingDelayMs(ringIndex: number): number {
  return (
    DOEPHONE_HERO_INTRO_POLAR_START_MS +
    DOEPHONE_HERO_INTRO_RADIAL_MS +
    ringIndex * DOEPHONE_HERO_INTRO_RING_STAGGER_MS
  );
}

function polarOverlayEndMs(): number {
  return (
    doephoneHeroIntroRingDelayMs(DOEPHONE_HERO_INTRO_RING_COUNT - 1) + DOEPHONE_HERO_INTRO_RING_MS
  );
}

export function doephoneHeroIntroHeadlineDelayMs(line: 1 | 2 | "cta"): number {
  const base = polarOverlayEndMs() + HEADLINE_PAD_MS;
  if (line === 1) return base;
  if (line === 2) return base + HEADLINE_LINE_GAP_MS;
  return base + HEADLINE_LINE_GAP_MS + HEADLINE_TO_CTA_MS;
}

/** CSS custom properties for hero intro timing (set on the hero section). */
export function doephoneHeroIntroStyleVars(): Record<string, string> {
  return {
    "--doephone-hero-polar-start": `${DOEPHONE_HERO_INTRO_POLAR_START_MS}ms`,
    "--doephone-hero-polar-radial-duration": `${DOEPHONE_HERO_INTRO_RADIAL_MS}ms`,
    "--doephone-hero-polar-ring-duration": `${DOEPHONE_HERO_INTRO_RING_MS}ms`,
    "--doephone-hero-headline-1": `${doephoneHeroIntroHeadlineDelayMs(1)}ms`,
    "--doephone-hero-headline-2": `${doephoneHeroIntroHeadlineDelayMs(2)}ms`,
    "--doephone-hero-headline-cta": `${doephoneHeroIntroHeadlineDelayMs("cta")}ms`,
  };
}
