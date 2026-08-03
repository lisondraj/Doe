"use client";

import { useDoeHealthLandingNavContext } from "@/lib/doehealth/doehealth-nav-chrome";
import { inter } from "@/lib/home/fonts";
import {
  MOBILE_NAV_ACTION_CTA_LAYOUT,
  MOBILE_NAV_SPLIT_SHELL_TW,
} from "@/lib/subpage/mobile-nav-styles";

/** iPhone gold nav — pill Waitlist CTA beside the mail button. */
export function MobileNavWaitlistButton({
  shadow = "none",
}: {
  shadow?: string;
} = {}) {
  const show = useDoeHealthLandingNavContext();
  if (!show) return null;

  return (
    <div
      className={`${MOBILE_NAV_SPLIT_SHELL_TW} proto-nav-cta-shell doehealth-nav-waitlist-shell`}
      style={{ boxShadow: shadow }}
    >
      <button
        type="button"
        className={`${MOBILE_NAV_ACTION_CTA_LAYOUT} proto-nav-cta-label doehealth-nav-waitlist-label cursor-pointer appearance-none border-0 bg-transparent rounded-md px-[1.35rem] font-semibold text-[0.96875rem] iphone-page:px-[clamp(1.28rem,1rem+1.2vmin,1.58rem)] iphone-page:text-[clamp(1.06rem,0.95rem+0.65vmin,1.22rem)] ${inter.className}`}
      >
        Waitlist
      </button>
    </div>
  );
}
