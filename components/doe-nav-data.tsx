import type { CSSProperties } from "react";

export type MobileNavFooterShape = "triangle" | "circle" | "square";

export type MobileNavFooterLineOverlay = {
  backgroundImage: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  opacity: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
};

/** Second-section carousel slide 1 — Care routing (dotted grid). */
const WF_NAV_SLIDE_1_OVERLAY: MobileNavFooterLineOverlay = {
  backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.25) 1.5px, transparent 1.5px)`,
  backgroundSize: "50px 50px",
  opacity: 1,
};

/** Second-section carousel slide 2 — Referral Intake (crosshatch + center dot). */
const WF_NAV_SLIDE_2_OVERLAY: MobileNavFooterLineOverlay = {
  backgroundImage: [
    `radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)`,
    `repeating-linear-gradient(0deg, transparent 0, transparent calc(56px - 0.8px), rgba(255, 255, 255, 0.12) calc(56px - 0.8px), rgba(255, 255, 255, 0.12) 56px)`,
    `repeating-linear-gradient(90deg, transparent 0, transparent calc(56px - 0.8px), rgba(255, 255, 255, 0.12) calc(56px - 0.8px), rgba(255, 255, 255, 0.12) 56px)`,
  ].join(", "),
  backgroundSize: "56px 56px",
  backgroundPosition: "28px 28px, 0 0, 0 0",
  opacity: 1,
};

/** Second-section carousel slide 3 — AI Receptionist (diagonal grid). */
const WF_NAV_SLIDE_3_OVERLAY: MobileNavFooterLineOverlay = {
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) 60px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) 60px
    )`,
  backgroundSize: "60px 60px",
  opacity: 1,
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
    gradient: "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
    lineOverlay: WF_NAV_SLIDE_1_OVERLAY,
  },
  {
    boxTitle: "Doe Ecosystem",
    outside: "Orchestration Over Rip-and-Replace",
    shape: "circle",
    date: "April 28, 2026",
    gradient:
      "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
    lineOverlay: WF_NAV_SLIDE_2_OVERLAY,
  },
  {
    boxTitle: "For Students",
    outside: "Spaced Practice With Bedside Citations",
    shape: "square",
    date: "June 3, 2026",
    gradient:
      "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
    lineOverlay: WF_NAV_SLIDE_3_OVERLAY,
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
