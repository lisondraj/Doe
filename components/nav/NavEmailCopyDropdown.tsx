import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import {
  NAV_EMAIL_DROPDOWN_ADDRESS_TW,
  NAV_EMAIL_DROPDOWN_BG,
  NAV_EMAIL_DROPDOWN_CHECK_TW,
  NAV_EMAIL_DROPDOWN_COPIED_TW,
  NAV_EMAIL_DROPDOWN_DIVIDER,
  NAV_EMAIL_DROPDOWN_FG,
  NAV_EMAIL_DROPDOWN_PANEL_TW,
} from "@/lib/subpage/nav-email-dropdown-styles";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="m5.5 10.25 2.75 2.75 6.25-6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared nav email copy dropdown panel. */
export function NavEmailCopyDropdown({
  copied,
  attachClassName,
  bg = NAV_EMAIL_DROPDOWN_BG,
  fg = NAV_EMAIL_DROPDOWN_FG,
  divider = NAV_EMAIL_DROPDOWN_DIVIDER,
}: {
  copied: boolean;
  attachClassName: string;
  bg?: string;
  fg?: string;
  divider?: string;
}) {
  return (
    <div
      className={`proto-nav-email-dropdown proto-nav-cta-dropdown ${attachClassName} ${NAV_EMAIL_DROPDOWN_PANEL_TW}`}
      style={{
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${divider}`,
      }}
    >
      <p className={NAV_EMAIL_DROPDOWN_ADDRESS_TW}>{ABOUT_CONTACT_EMAIL}</p>

      {copied ? (
        <p className={NAV_EMAIL_DROPDOWN_COPIED_TW}>
          <CheckIcon className={NAV_EMAIL_DROPDOWN_CHECK_TW} />
          Copied to clipboard
        </p>
      ) : null}
    </div>
  );
}
