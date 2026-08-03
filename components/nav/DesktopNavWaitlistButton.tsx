"use client";

import Link from "next/link";

import { useDoeHealthLandingNavContext } from "@/lib/doehealth/doehealth-nav-chrome";
import { inter } from "@/lib/home/fonts";
import {
  DESKTOP_NAV_ACTION_HEIGHT_TW,
} from "@/lib/subpage/desktop-nav-styles";
import { WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop gold nav — pill Waitlist CTA beside the mail button (non-hero punched bar only). */
export function DesktopNavWaitlistButton({
  shadow = "none",
  punched = false,
}: {
  shadow?: string;
  punched?: boolean;
} = {}) {
  const show = useDoeHealthLandingNavContext();
  if (!show) return null;

  const radius = punched ? "rounded-full" : "rounded-md";

  return (
    <div
      className={`relative flex shrink-0 items-stretch overflow-visible ${radius} proto-nav-cta-shell doehealth-nav-waitlist-shell`}
      style={{ boxShadow: shadow }}
    >
      <Link
        href={WAITLIST_PATH}
        className={`inline-flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center justify-center ${radius} px-4 text-[0.9375rem] font-medium leading-none no-underline transition-[opacity,background-color,color,box-shadow] duration-300 hover:opacity-90 proto-nav-cta-label ${inter.className}`}
      >
        Waitlist
      </Link>
    </div>
  );
}
