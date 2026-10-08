import { ABOUT_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop nav split-button primary CTA on /doecarefall26. */
export const DOECAREFALL26_DESK_NAV_PRIMARY_CTA = {
  label: "Get Your Model",
  href: WAITLIST_PATH,
} as const;

/** Desk announcement strip above the nav. */
export const DOECAREFALL26_DESK_ANNOUNCEMENT = {
  message: "We're gearing up for launch!",
  /** iPhone — same line, inline with Learn more. */
  phoneMessage: "We're gearing up for launch!",
  linkLabel: "Learn more",
  href: ABOUT_PATH,
} as const;

/** Center column on /doecarefall26 desktop nav. */
export const DOECAREFALL26_DESK_NAV_CENTER_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Genome", href: "#genome" },
  { label: "Agents", href: "#agents" },
  { label: "Investors", href: ABOUT_PATH },
] as const;
