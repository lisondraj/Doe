"use client";

import type { CSSProperties, ReactNode } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { cssVars as vars, scrollRamp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

/**
 * Shared by the product and trust sections on /earlypreview, which follow the go-to-market section's lock: each
 * screen gets SPAN units of scroll progress on its own clock `t`, starting at 0 as it begins to come in.
 */
export const SPAN = 2;
const SCENE = { in: [0, 0.2], title: [0, 0.6], out: [SPAN - 0.2, SPAN] } as const;

/** The last screen holds once it has built, then the lock releases. */
export const lockEnd = (count: number) => (count - 1) * SPAN + 1.5;

export const ramp = (t: number, from: number, to: number) => scrollRamp(t, [from, to]);
/** Fade in and rise a little, set by `--e` (0 to 1). */
export const rise = (e: number) => vars({ "--e": e });

export function screenOpacity(t: number, index: number, count: number) {
  const fadeIn = index === 0 ? 1 : ramp(t, ...SCENE.in);
  const fadeOut = index === count - 1 ? 0 : ramp(t, ...SCENE.out);
  return fadeIn * (1 - fadeOut);
}

/** A screen is mounted only around its own stretch of the scroll. */
export function isShown(p: number, index: number, count: number) {
  const t = p - index * SPAN;
  return (index === 0 || t > -0.02) && (index === count - 1 || t < SPAN + 0.02);
}

export type EarlyPreviewTitle = readonly [string, string];

/** One screen: the two-line title top left (second line salmon), the visual filling the space under it. */
export function LockedScreen({
  index,
  count,
  title,
  t,
  className,
  children,
}: {
  index: number;
  count: number;
  title: EarlyPreviewTitle;
  t: number;
  className: string;
  children: ReactNode;
}) {
  const o = screenOpacity(t, index, count);
  const s = ramp(t, ...SCENE.title);
  const closing = index === count - 1;
  return (
    <div className={`earlypreview-lock__scene${closing ? " earlypreview-lock__scene--closing" : ""}`} style={vars({ "--o": o })} aria-hidden={o < 0.5}>
      <div className={`earlypreview-lock__frame ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <h2 className="earlypreview-lock__title">
          {title.map((line, i) => (
            <span key={line} className={`desk2-genome-swipe desk2-genome-swipe--${i === 0 ? "cream" : "salmon"}`} style={vars({ "--s": s })}>
              {line}
            </span>
          ))}
        </h2>
        <div className={`earlypreview-lock__body ${className} ${inter.className}`}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ UI kit */

/** The root of any product UI: sized in em off the viewport so it scales as one piece, in the app's face. */
export const EP_UI = `ep-ui ${dmSans.className}`;

/** Line icons on a 24 x 24 grid, drawn like the app's own. */
const ICONS = {
  search: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4.2-4.2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  inbox: "M4 13.5L6.2 5h11.6L20 13.5V19H4zM4 13.5h4.8l1.4 2.2h3.6l1.4-2.2H20",
  phone: "M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z",
  list: "M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
  user: "M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0",
  link: "M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1",
  clock: "M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 7.5V12l3 2",
  shield: "M12 3.5l7 2.8v5.4c0 4.4-2.9 7.5-7 8.8-4.1-1.3-7-4.4-7-8.8V6.3z",
  lock: "M6.5 10.5h11v9h-11zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  arrowUp: "M12 19V5.5M6.5 11L12 5.5 17.5 11",
  doc: "M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12.5h6M9.5 16h6",
  card: "M3.5 6.5h17v11h-17zM3.5 10.5h17M7 14.5h3",
  mapPin: "M12 20.5s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0c0 4.9 6.5 10.5 6.5 10.5zM12 12a2 2 0 1 0 0-4a2 2 0 1 0 0 4z",
  alert: "M12 4.5l8.5 15h-17zM12 10v4M12 17h.01",
} as const;

export type EpIconName = keyof typeof ICONS;

export function EpIcon({ name, className = "" }: { name: EpIconName; className?: string }) {
  return (
    <svg className={`ep-icon ${className}`} viewBox="0 0 24 24" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

export type EpTone = "salmon" | "sage" | "sand" | "ink" | "paper" | "soft";

export function EpChip({ tone = "soft", icon, className = "", style, children }: { tone?: EpTone; icon?: EpIconName; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <span className={`ep-chip ep-chip--${tone} ${className}`} style={style}>
      {icon ? <EpIcon name={icon} /> : null}
      {children}
    </span>
  );
}

/** The app's tinted square avatars: initials on a soft tone. */
export function EpAvatar({ label, tone = "salmon" }: { label: string; tone?: EpTone }) {
  return <span className={`ep-avatar ep-chip--${tone}`}>{label}</span>;
}

/** Serif heading inside the UI, in the app's display face. */
export function EpHeading({ className = "", children }: { className?: string; children: ReactNode }) {
  return <span className={`ep-heading ${p22Mackinac.className} ${className}`}>{children}</span>;
}

const RAIL: EpIconName[] = ["inbox", "calendar", "phone", "list", "user", "link"];

/** The product's outer shell: an ink frame with the "D" rail, around a paper panel. Shown cropped by its parent. */
export function EpShell({ active = 0, className = "", style, children }: { active?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`ep-shell ${className}`} style={style}>
      <div className="ep-shell__rail" aria-hidden>
        <span className={`ep-shell__mark ${p22Mackinac.className}`}>D</span>
        <span className="ep-shell__icons">
          {RAIL.map((name, i) => (
            <span key={name} className={i === active ? "is-active" : undefined}>
              <EpIcon name={name} />
            </span>
          ))}
        </span>
      </div>
      <div className="ep-shell__panel">{children}</div>
    </div>
  );
}

/** An iPhone, drawn as a frame around its screen. */
export function EpPhone({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`ep-phone ${className}`} style={style}>
      <div className="ep-phone__screen">
        <span className="ep-phone__island" aria-hidden />
        {children}
      </div>
    </div>
  );
}
