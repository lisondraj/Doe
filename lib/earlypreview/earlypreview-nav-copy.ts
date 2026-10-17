import { ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";

/** /earlypreview's CTA: a mail link to James, with a chevron menu whose one item goes to the homepage. */
export const EARLYPREVIEW_NAV_CTA = {
  label: "Contact James",
  href: ABOUT_CONTACT_MAILTO,
  dropdownItems: [{ label: "Homepage", href: "https://doe.care" }],
} as const;
