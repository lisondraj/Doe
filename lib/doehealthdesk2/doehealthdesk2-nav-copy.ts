import { CAREERS_PATH } from "@/lib/doehealth/doehealth-careers";
import { ABOUT_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** Desktop nav split-button primary CTA on /doehealthdesk. */
export const DOEHEALTH_DESK2_NAV_PRIMARY_CTA = {
  label: "Find Your Clinic",
  href: WAITLIST_PATH,
} as const;

/** Desk announcement strip above the nav. */
export const DOEHEALTH_DESK2_ANNOUNCEMENT = {
  message: "Healthcare in the Era of Personal Agents",
  /** iPhone — shorter line, inline with See Video. */
  phoneMessage: "Healthcare & Personal Agents",
  linkLabel: "See Video",
  href: ABOUT_PATH,
} as const;

/** Chevron menu on the desk2 primary CTA — single option. */
export const DOEHEALTH_DESK2_NAV_PRIMARY_CTA_DROPDOWN_ITEMS = [
  { label: "For Investors", href: ABOUT_PATH },
  { label: "Careers", href: CAREERS_PATH },
] as const;

/** Center column on /doehealthdesk desktop nav. */
export const DOEHEALTH_DESK2_NAV_CENTER_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Agents", href: "#agents" },
  { label: "Security", href: "/security" },
] as const;

/** Center links with section anchors pointed at `base` — for desk2-chrome pages other than /doehealthdesk. */
export function doehealthDesk2NavCenterLinks(base = "") {
  return DOEHEALTH_DESK2_NAV_CENTER_LINKS.map((item) => ({
    label: item.label,
    href: item.href.startsWith("#") ? `${base}${item.href}` : item.href,
  }));
}

/** Nav bar pages on desktop and iPhone: Product, Agents, Security, Pricing, News, then Careers. The footer keeps the center links. */
export const DOEHEALTH_DESK2_NAV_PAGES = [
  { label: "Product", href: "/product-nav" },
  { label: "Agents", href: "#agents" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "News", href: "/news" },
  { label: "Careers", href: CAREERS_PATH },
] as const;

/** The nav bar's pages with section anchors pointed at `base`. The footer keeps the center links only. */
export function doehealthDesk2NavPages(base = "") {
  return DOEHEALTH_DESK2_NAV_PAGES.map((item) => ({
    label: item.label,
    href: item.href.startsWith("#") ? `${base}${item.href}` : item.href,
  }));
}
