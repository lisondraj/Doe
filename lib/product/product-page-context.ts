/** /product — touch devices always use iPhone layout scaling. */
export function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

export function isProductRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/product";
}

export function shouldLockProductTouchPhoneLayout(): boolean {
  return isProductRoute() && isTouchPrimaryDevice();
}
