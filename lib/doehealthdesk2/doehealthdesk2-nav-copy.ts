import { ABOUT_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop nav split-button primary CTA on /doehealthdesk. */
export const DOEHEALTH_DESK2_NAV_PRIMARY_CTA = {
  label: "Find Your Clinic",
  href: WAITLIST_PATH,
} as const;

/** Desk announcement strip above the nav. */
export const DOEHEALTH_DESK2_ANNOUNCEMENT = {
  message: "Doe raises $5.1M pre-seed to reinvent healthcare AI",
  /** iPhone — raise line + pre-seed, inline with Learn more. */
  phoneMessage: "Doe raises $5.1M pre-seed!",
  linkLabel: "Learn more",
  href: ABOUT_PATH,
} as const;

/** Chevron menu on the desk2 primary CTA — single option. */
export const DOEHEALTH_DESK2_NAV_PRIMARY_CTA_DROPDOWN_ITEMS = [
  { label: "For Investors", href: ABOUT_PATH },
] as const;

/** Center column on /doehealthdesk desktop nav. */
export const DOEHEALTH_DESK2_NAV_CENTER_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Agents", href: "#agents" },
  { label: "Security", href: ABOUT_PATH },
] as const;

/** Center links with section anchors pointed at `base` — for desk2-chrome pages other than /doehealthdesk. */
export function doehealthDesk2NavCenterLinks(base = "") {
  return DOEHEALTH_DESK2_NAV_CENTER_LINKS.map((item) => ({
    label: item.label,
    href: item.href.startsWith("#") ? `${base}${item.href}` : item.href,
  }));
}
