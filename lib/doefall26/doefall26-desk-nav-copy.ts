import { ABOUT_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop nav split-button primary CTA on /doefall26. */
export const DOE_FALL26_DESK_NAV_PRIMARY_CTA = {
  label: "Get Your Model",
  href: WAITLIST_PATH,
} as const;

/** Desk announcement strip above the nav. */
export const DOE_FALL26_DESK_ANNOUNCEMENT = {
  message: "Doe raises $5.1M pre-seed to reinvent healthcare AI",
  /** iPhone — raise line + pre-seed, inline with Learn more. */
  phoneMessage: "Doe raises $5.1M pre-seed!",
  linkLabel: "Learn more",
  href: ABOUT_PATH,
} as const;

/** Center column on /doefall26 desktop nav. */
export const DOE_FALL26_DESK_NAV_CENTER_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Genome", href: "#genome" },
  { label: "Agents", href: "#agents" },
  { label: "Investors", href: ABOUT_PATH },
] as const;
