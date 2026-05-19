import type { CSSProperties } from "react";

export type MobileNavFooterShape = "triangle" | "circle" | "square";

export type MobileNavFooterLineOverlay = {
  backgroundImage: string;
  opacity: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
};

export const MOBILE_NAV_FOOTER_SLIDES: ReadonlyArray<{
  boxTitle: string;
  outside: string;
  shape: MobileNavFooterShape;
  date: string;
  gradient: string;
  lineOverlay: MobileNavFooterLineOverlay;
}> = [
  {
    boxTitle: "Inquisara",
    outside: "Meet the Founders",
    shape: "triangle",
    date: "March 12, 2026",
    gradient:
      "linear-gradient(142deg, #f0b24a 0%, #e08a3c 32%, #c45a32 58%, #7a3028 82%, #132428 100%)",
    /** Same dual-line mesh as hero + page footer (app/page.tsx) */
    lineOverlay: {
      backgroundImage: `
        repeating-linear-gradient(
          -32deg,
          transparent 0px,
          transparent 11px,
          rgba(255, 255, 255, 0.09) 11px,
          rgba(255, 255, 255, 0.09) 12px
        ),
        repeating-linear-gradient(
          32deg,
          transparent 0px,
          transparent 15px,
          rgba(30, 52, 58, 0.14) 15px,
          rgba(30, 52, 58, 0.14) 16px
        )`,
      opacity: 0.55,
      mixBlendMode: "soft-light",
    },
  },
  {
    boxTitle: "Doe Ecosystem",
    outside: "Orchestration Over Rip-and-Replace",
    shape: "circle",
    date: "April 28, 2026",
    gradient:
      "radial-gradient(120% 90% at 12% 8%, #facc6b 0%, #e8924a 35%, #b84a36 62%, #2d3840 92%, #0f171c 100%)",
    lineOverlay: {
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 26px,
          rgba(255, 255, 255, 0.1) 26px,
          rgba(255, 255, 255, 0.1) 29px,
          transparent 29px,
          transparent 54px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 30px,
          rgba(20, 35, 50, 0.22) 30px,
          rgba(20, 35, 50, 0.22) 33px,
          transparent 33px,
          transparent 62px
        )`,
      opacity: 0.48,
      mixBlendMode: "soft-light",
    },
  },
  {
    boxTitle: "For Students",
    outside: "Spaced Practice With Bedside Citations",
    shape: "square",
    date: "June 3, 2026",
    gradient:
      "linear-gradient(162deg, #fce8b4 0%, #f2b056 26%, #d87435 54%, #a84828 78%, #142026 100%)",
    lineOverlay: {
      backgroundImage: `
        repeating-linear-gradient(
          -34deg,
          transparent 0px,
          transparent 17px,
          rgba(255, 246, 220, 0.2) 17px,
          rgba(255, 246, 220, 0.2) 20px,
          transparent 20px,
          transparent 40px
        ),
        repeating-linear-gradient(
          52deg,
          transparent 0px,
          transparent 21px,
          rgba(92, 32, 18, 0.14) 21px,
          rgba(92, 32, 18, 0.14) 23px,
          transparent 23px,
          transparent 46px
        )`,
      opacity: 0.5,
      mixBlendMode: "overlay",
    },
  },
];

export function MobileNavFooterShapeIcon({
  shape,
  className,
}: {
  shape: MobileNavFooterShape;
  className?: string;
}) {
  const cn =
    className ??
    "shrink-0 w-[5.5rem] h-[5.5rem] iphone-page:w-[clamp(4.75rem,12vmin,8.25rem)] iphone-page:h-[clamp(4.75rem,12vmin,8.25rem)] opacity-95 drop-shadow-sm";
  if (shape === "triangle") {
    return (
      <svg viewBox="0 0 24 24" className={cn} aria-hidden>
        <path fill="currentColor" d="M12 2.5 L21.5 21.5 L2.5 21.5 Z" />
      </svg>
    );
  }
  if (shape === "circle") {
    return (
      <svg viewBox="0 0 24 24" className={cn} aria-hidden>
        <circle cx="12" cy="12" r="7.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cn} aria-hidden>
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export type DropdownNavItem = { title: string; desc: string; href?: string };

/** Subpages disabled for now — kept for future mega-menu. */
export const dropdownContent: Record<
  string,
  { items: DropdownNavItem[]; featured?: { title: string; desc: string } }
> = {
  Features: {
    items: [
      { title: "Clinical Inbox", desc: "Summaries clinicians verify—not babysit." },
      { title: "Finance", desc: "Payer packets drafted with citations." },
      { title: "Brain", desc: "Frontier models at the point of care." },
      { title: "Academics", desc: "Education tracks on the same clinical graph." },
    ],
    featured: { title: "Doe Platform", desc: "The end-to-end AI layer for modern healthcare delivery." },
  },
  Blog: { items: [] },
  Team: { items: [] },
  "Our Vision": { items: [] },
};

export const NAV_ITEMS = ["Features", "Blog", "Team", "Our Vision"] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

export const NAV_HREFS: Record<NavItem, string> = {
  Features: "/features",
  Blog: "/blog",
  Team: "/",
  "Our Vision": "/",
};
