"use client";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import {
  NAV_EMAIL_DROPDOWN_BG,
  NAV_EMAIL_DROPDOWN_FG,
} from "@/lib/subpage/nav-email-dropdown-styles";
import {
  DESKTOP_NAV_ACTION_HEIGHT_TW,
  DESKTOP_NAV_ACTION_SIZE,
} from "@/lib/subpage/desktop-nav-styles";
import { NavMailIcon } from "@/components/nav/NavMailIcon";

/** Desktop nav — square email button (dropdown rendered by DesktopNavActionRow). */
export function DesktopNavEmailButton({
  bg = NAV_EMAIL_DROPDOWN_BG,
  fg = NAV_EMAIL_DROPDOWN_FG,
  shadow = "none",
  open = false,
  onToggle,
  punched = false,
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
  open?: boolean;
  onToggle?: () => void;
  punched?: boolean;
}) {
  const radius = punched ? "rounded-full" : "rounded-md";

  return (
    <div className="relative flex shrink-0 items-center">
      <div
        className={`relative flex items-stretch overflow-visible ${radius}${punched ? " proto-nav-cta-shell" : ""}`}
        style={{ boxShadow: shadow }}
      >
        <button
          type="button"
          className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center justify-center ${radius} transition-[opacity,background-color,color,box-shadow] duration-300 hover:opacity-90`}
          style={{
            backgroundColor: bg,
            color: fg,
            width: DESKTOP_NAV_ACTION_SIZE,
          }}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
          onClick={onToggle}
        >
          <NavMailIcon className="h-[1.25rem] w-[1.25rem]" />
        </button>
      </div>
    </div>
  );
}
