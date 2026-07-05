import { shouldLockAboutTouchPhoneLayout } from "@/lib/about/about-page-context";
import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";
import { shouldLockHomeTouchPhoneLayout } from "@/lib/home/home-page-context";

/** Real desktop/laptop — excludes phones even in “Request Desktop Website” mode. */
export const DOEPHONE_DESKTOP_MEDIA_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

export type DoePhoneVariant = "phone" | "desktop";

export function resolveDoePhoneVariant(): DoePhoneVariant {
  if (typeof window === "undefined") return "phone";

  if (
    shouldLockDesignersTouchPhoneLayout() ||
    shouldLockHomeTouchPhoneLayout() ||
    shouldLockAboutTouchPhoneLayout()
  ) {
    return "phone";
  }

  if (window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY).matches) {
    return "desktop";
  }

  return "phone";
}
