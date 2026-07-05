/** Doe home (/) — touch devices always use iPhone layout scaling. */
export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

export function isHomeRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/";
}

export function shouldLockHomeTouchPhoneLayout(): boolean {
  return isHomeRoute() && isTouchPrimaryDevice();
}
