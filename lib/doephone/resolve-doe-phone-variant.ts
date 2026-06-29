/** Real desktop/laptop — excludes phones even in “Request Desktop Website” mode. */
export const DOEPHONE_DESKTOP_MEDIA_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

export type DoePhoneVariant = "phone" | "desktop";

/** Prefer pointer/viewport over UA so iOS desktop-site mode still gets phone layout. */
export function resolveDoePhoneVariant(): DoePhoneVariant {
  if (typeof window === "undefined") return "phone";

  if (window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY).matches) {
    return "desktop";
  }

  return "phone";
}
