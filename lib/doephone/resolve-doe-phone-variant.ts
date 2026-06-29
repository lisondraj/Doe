/** Matches DoePhoneRouter — real desktop/laptop, not phone landscape. */
export const DOEPHONE_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

export type DoePhoneVariant = "phone" | "desktop";

/** Prefer viewport width over UA so iOS “Request Desktop Website” still gets phone layout on narrow screens. */
export function resolveDoePhoneVariant(): DoePhoneVariant {
  if (typeof window === "undefined") return "phone";
  return window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY).matches ? "desktop" : "phone";
}
