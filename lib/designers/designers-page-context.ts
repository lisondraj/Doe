import { isDesignersHost } from "@/lib/site-domains";
import { isDoeHealthLandingRoute } from "@/lib/doehealth/doehealth-landing-paths";

/** doehealth.care (all routes), /doehealth, or legacy /designers preview. */
export function isDesignersPageContext(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  const host = window.location.hostname;
  return isDesignersHost(host) || isDoeHealthLandingRoute(path);
}

export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

/** iPhone/iPad on the doehealth landing — never promote to desktop layout. */
export function shouldLockDesignersTouchPhoneLayout(): boolean {
  return isDesignersPageContext() && isTouchPrimaryDevice();
}
