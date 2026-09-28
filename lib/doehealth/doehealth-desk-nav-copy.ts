import { ABOUT_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop nav split-button primary CTA on /doehealthdesk. */
export const DOEHEALTH_DESK_NAV_PRIMARY_CTA = {
  label: "Get Your Model",
  href: WAITLIST_PATH,
} as const;

/** Desk announcement strip above the nav. */
export const DOEHEALTH_DESK_ANNOUNCEMENT = {
  message: "Doe raises $5.1M pre-seed to reinvent healthcare AI.",
  linkLabel: "Learn more",
  href: ABOUT_PATH,
} as const;

/** Center column on /doehealthdesk desktop nav. */
export const DOEHEALTH_DESK_NAV_CENTER_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Genome", href: "#genome" },
  { label: "Agents", href: "#agents" },
  { label: "Investors", href: ABOUT_PATH },
] as const;
