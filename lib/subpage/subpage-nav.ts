import { INVESTORS_PATH, JOIN_PATH, WAITLIST_PATH } from "@/lib/site-domains";

export const FOR_INVESTORS_LABEL = "For Investors";
export const CONTACT_US_HREF = "mailto:james@doe.care?subject=Contact%20Us";

export const SUBPAGE_NAV_LINK_CLASS =
  "inline-flex shrink-0 items-center text-base font-normal text-black no-underline transition-opacity hover:opacity-70 active:opacity-60";

export const SUBPAGE_NAV_DOT_CLASS = "shrink-0 select-none text-base text-black/35";

export type SubpageNavVariant = "main" | "join" | "investors" | "waitlist";

export function subpageNavLinks(variant: SubpageNavVariant) {
  switch (variant) {
    case "main":
      return [
        { kind: "link" as const, label: "Team", href: JOIN_PATH },
        { kind: "link" as const, label: FOR_INVESTORS_LABEL, href: INVESTORS_PATH },
        { kind: "link" as const, label: "Waitlist", href: WAITLIST_PATH },
      ];
    case "join":
      return [
        { kind: "link" as const, label: FOR_INVESTORS_LABEL, href: INVESTORS_PATH },
        { kind: "link" as const, label: "Waitlist", href: WAITLIST_PATH },
      ];
    case "investors":
      return [
        { kind: "link" as const, label: "Team", href: JOIN_PATH },
        { kind: "link" as const, label: "Waitlist", href: WAITLIST_PATH },
      ];
    case "waitlist":
      return [
        { kind: "link" as const, label: "Team", href: JOIN_PATH },
        { kind: "link" as const, label: FOR_INVESTORS_LABEL, href: INVESTORS_PATH },
      ];
  }
}

export function subpageNavButton(variant: SubpageNavVariant) {
  switch (variant) {
    case "join":
      return { kind: "scroll-apply" as const, label: "Apply" };
    case "investors":
      return { kind: "href" as const, label: "Contact Us", href: CONTACT_US_HREF };
    case "waitlist":
      return { kind: "scroll-apply" as const, label: "Sign Up" };
    default:
      return null;
  }
}

/** Main mobile home — expanded nav sheet links (order matters). */
export const MAIN_HOME_NAV_SHEET_ITEMS = [
  { label: FOR_INVESTORS_LABEL, href: INVESTORS_PATH },
  { label: "Waitlist", href: WAITLIST_PATH },
  { label: "Team", href: JOIN_PATH },
] as const;

/** Main desktop home — For Investors split-button menu. */
export const DESKTOP_MAIN_CTA_MENU_ITEMS = [
  { label: FOR_INVESTORS_LABEL, href: INVESTORS_PATH },
  { label: "Waitlist", href: WAITLIST_PATH },
  { label: "Join Us", href: JOIN_PATH },
] as const;
