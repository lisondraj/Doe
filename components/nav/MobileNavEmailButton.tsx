"use client";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import {
  MOBILE_NAV_MAIL_BUTTON_TW,
  MOBILE_NAV_MAIL_ICON_TW,
  MOBILE_NAV_SPLIT_SHELL_TW,
} from "@/lib/subpage/mobile-nav-styles";
import {
  NAV_EMAIL_DROPDOWN_BG,
  NAV_EMAIL_DROPDOWN_FG,
} from "@/lib/subpage/nav-email-dropdown-styles";
import { NavMailIcon } from "@/components/nav/NavMailIcon";

/** iPhone nav — square email button (dropdown rendered by MobileNavActionRow). */
export function MobileNavEmailButton({
  bg = NAV_EMAIL_DROPDOWN_BG,
  fg = NAV_EMAIL_DROPDOWN_FG,
  shadow = "none",
  open = false,
  onToggle,
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="relative flex shrink-0 items-center">
      <div
        className={`${MOBILE_NAV_SPLIT_SHELL_TW} proto-nav-cta-shell${open ? " proto-nav-cta-shell--open" : ""}`}
        style={{ boxShadow: shadow }}
      >
        <button
          type="button"
          className={`${MOBILE_NAV_MAIL_BUTTON_TW} transition-[opacity,background-color,color,box-shadow] duration-300 hover:opacity-90 active:opacity-80`}
          style={{ backgroundColor: bg, color: fg }}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
          onClick={onToggle}
        >
          <NavMailIcon className={MOBILE_NAV_MAIL_ICON_TW} />
        </button>
      </div>
    </div>
  );
}
