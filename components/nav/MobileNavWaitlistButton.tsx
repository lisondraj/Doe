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
      <span
        className={`${MOBILE_NAV_ACTION_CTA_LAYOUT} proto-nav-cta-label rounded-md px-6 font-medium text-[0.9375rem] iphone-page:px-[clamp(1.2rem,0.95rem+1.15vmin,1.5rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.62vmin,1.18rem)] ${inter.className}`}
      >
        Waitlist
      </span>
    </div>
  );
}
