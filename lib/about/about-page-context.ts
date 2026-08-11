import { isJoinCampusPagePath } from "@/lib/join/join-campus-page-path";
import { isPremedPagePath } from "@/lib/premed/premed-path";

/** Doe /about — touch devices always use iPhone layout scaling. */
export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

export function isAboutRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/about";
}

/** doe.care /join — iPhone layout on touch devices; desktop browsers use desktop layout. */
export function shouldLockJoinCampusPhoneLayout(): boolean {
  if (typeof window === "undefined") return false;
  const { pathname, hostname } = window.location;
  if (!isJoinCampusPagePath(pathname, hostname)) return false;
  return isTouchPrimaryDevice();
}

export function shouldLockAboutTouchPhoneLayout(): boolean {
  if (typeof window === "undefined") return false;
  const { pathname, hostname } = window.location;
  if (shouldLockJoinCampusPhoneLayout()) return true;
  if (!isTouchPrimaryDevice()) return false;
  return pathname === "/about" || isPremedPagePath(pathname, hostname);
}
