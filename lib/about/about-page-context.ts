/** Doe /about — touch devices always use iPhone layout scaling. */
export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

export function isAboutRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/about";
}

export function shouldLockAboutTouchPhoneLayout(): boolean {
  return isAboutRoute() && isTouchPrimaryDevice();
}
