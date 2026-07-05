import { shouldLockAboutTouchPhoneLayout } from "@/lib/about/about-page-context";
import { shouldLockHomeTouchPhoneLayout } from "@/lib/home/home-page-context";

/** Doe home + /about — touch devices always use iPhone layout scaling. */
export function shouldLockDoeTouchPhoneLayout(): boolean {
  return shouldLockHomeTouchPhoneLayout() || shouldLockAboutTouchPhoneLayout();
}
