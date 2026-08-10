import { DOEHEALTH_PATH, DESIGNERS_PATH } from "@/lib/site-domains";

export { DOEHEALTH_PATH, DESIGNERS_PATH };

/** Editable doehealth landing route — also served at doehealth.care `/`. */
export function isDoeHealthLandingPath(path: string): boolean {
  return path === DOEHEALTH_PATH || path.startsWith(`${DOEHEALTH_PATH}/`);
}

/** Legacy preview route — kept for doe.care/designers. */
export function isDesignersLandingPath(path: string): boolean {
  return path === DESIGNERS_PATH || path.startsWith(`${DESIGNERS_PATH}/`);
}

export function isDoeHealthLandingRoute(path: string): boolean {
  return isDoeHealthLandingPath(path) || isDesignersLandingPath(path);
}
