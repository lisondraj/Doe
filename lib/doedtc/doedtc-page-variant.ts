export const DOEDTC_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
export const DOEDTC_DEVICE_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

export type DoeDtcPageVariant = "desktop" | "phone";

export function resolveDoeDtcPageVariant(): DoeDtcPageVariant {
  if (typeof window === "undefined") return "phone";
  const desktop =
    window.matchMedia(DOEDTC_DESKTOP_MEDIA_QUERY).matches || window.innerWidth >= 1024;
  return desktop ? "desktop" : "phone";
}
