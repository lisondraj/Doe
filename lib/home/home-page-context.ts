import { isPremedPagePath } from "@/lib/premed/premed-path";

/** Doe home (/) — touch devices always use iPhone layout scaling. */
export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

/** Legacy home at `/` — not doe.care premed (which also uses pathname `/`). */
export function isHomeRoute(): boolean {
  if (typeof window === "undefined") return false;
  const { pathname, hostname } = window.location;
  if (isPremedPagePath(pathname, hostname)) return false;
  return pathname === "/";
}

export function shouldLockHomeTouchPhoneLayout(): boolean {
  return isHomeRoute() && isTouchPrimaryDevice();
}
