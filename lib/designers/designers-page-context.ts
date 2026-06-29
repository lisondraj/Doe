import { isDesignersHost } from "@/lib/site-domains";

/** doehealth.care root or /designers on any host. */
export function isDesignersPageContext(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return (
    isDesignersHost(window.location.hostname) ||
    path === "/designers" ||
    path.startsWith("/designers/")
  );
}

export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

/** iPhone/iPad on the designers landing — never promote to desktop layout. */
export function shouldLockDesignersTouchPhoneLayout(): boolean {
  return isDesignersPageContext() && isTouchPrimaryDevice();
}
