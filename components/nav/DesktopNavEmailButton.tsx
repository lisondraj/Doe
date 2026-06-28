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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 7.25h16c.69 0 1.25.56 1.25 1.25v9c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25v-9c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m5.25 8.5 6.75 4.75L18.75 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Desktop nav — square email button (dropdown rendered by DesktopNavActionRow). */
export function DesktopNavEmailButton({
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
      <div className="relative flex items-stretch overflow-visible rounded-md" style={{ boxShadow: shadow }}>
        <button
          type="button"
          className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center justify-center rounded-md transition-[opacity,background-color,color,box-shadow] duration-300 hover:opacity-90`}
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
          <MailIcon className="h-[1.25rem] w-[1.25rem]" />
        </button>
      </div>
    </div>
  );
}
