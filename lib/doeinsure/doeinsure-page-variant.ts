/** /doeinsure desktop — width only so Mac trackpads and Safari still get desktop layout. */
export const DOEINSURE_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

export const DOEINSURE_DEVICE_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

export type DoeInsurePageVariant = "phone" | "desktop";

export function resolveDoeInsurePageVariant(): DoeInsurePageVariant {
  if (typeof window === "undefined") return "phone";
  if (document.documentElement.getAttribute("data-layout") === "desktop") return "desktop";
  if (window.matchMedia(DOEINSURE_DESKTOP_MEDIA_QUERY).matches) return "desktop";
  return "phone";
}
