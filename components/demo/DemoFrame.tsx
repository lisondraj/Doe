"use client";

import Link from "next/link";
import { type ReactNode } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import { dmSans, lora } from "@/lib/home/fonts";

export const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
export const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * The /demo screen: Doe's brown fills the window, and the page sits in a cream box with rounded corners on every
 * side, inset like a phone's screen on iPhone and like /doehealthproduct's shell on desktop. The box scrolls on its
 * own, so the brown edge stays put.
 */
export function DemoFrame({
  children,
  right,
  overlay,
  logoHref,
  agentView = false,
  edgeFade = false,
}: {
  children: ReactNode;
  /** Marks the page as one only the user's agent sees. */
  agentView?: boolean;
  /** Sits opposite the Doe mark in the top bar. */
  right?: ReactNode;
  /** Drawn over the box's content but inside its rounded edge (sheets, drawers). */
  overlay?: ReactNode;
  logoHref?: string;
  /** Fades whatever scrolls past the top or bottom edge of the box, as on /indexconvert's opening screen. */
  edgeFade?: boolean;
}) {
  /** Set like /indexconvert's (and /earlypreview's) nav: Lora, regular weight. */
  const mark = <span className={`${lora.className} text-[30px] leading-[30px] md:text-[36px] md:leading-[36px] font-normal text-[#3A2516]`}>Doe</span>;
  return (
    <div
      className={`${dmSans.className} doehealth-product-page fixed inset-0 bg-[#3A2516] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
      }}
    >
      <div className="relative h-full w-full overflow-clip rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-[12px] h-[64px] md:h-[72px] px-[18px] md:px-[32px] bg-[#FFFCF1E6] backdrop-blur-[12px]">
            <span className="flex items-center gap-[10px]">
              {logoHref ? (
                <Link href={logoHref} aria-label="Doe">
                  {mark}
                </Link>
              ) : (
                mark
              )}
              {agentView && <AgentViewTag />}
            </span>
            {right}
          </header>
          {children}
        </div>
        {edgeFade && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[64px] md:top-[72px] z-20 h-[22px]"
              style={{ background: "linear-gradient(to bottom, #FFFCF1 0%, rgba(255,252,241,0) 100%)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[96px]"
              style={{ background: "linear-gradient(to top, #FFFCF1 6%, rgba(255,252,241,0.82) 38%, rgba(255,252,241,0) 100%)" }}
            />
          </>
        )}
        {overlay}
      </div>
    </div>
  );
}

/** "Agent view": the page is for the user's agent, not the user. */
function AgentViewTag() {
  return (
    <span className="h-[26px] pl-[8px] pr-[10px] flex items-center gap-[6px] rounded-full bg-[#3A2516] text-[#FFFCF1] text-[11.5px] font-[600] tracking-[0.01em]">
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      </svg>
      Agent View
    </span>
  );
}

export function Check({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center rounded-[7px] transition-colors duration-150"
      style={{
        width: size,
        height: size,
        backgroundColor: on ? "#3A2516" : "transparent",
        border: on ? "none" : "1.5px solid #28191040",
      }}
      aria-hidden="true"
    >
      {on && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/**
 * A sheet that rises from the bottom, as /pricing's do: full width with rounded top corners on iPhone, a centered
 * panel on wider screens. Drawn in DemoFrame's overlay, so it stays inside the cream box's rounded edge.
 */
export function Sheet({
  open,
  onClose,
  label,
  title,
  subtitle,
  lead,
  wide = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Sits before the title (a back button). */
  lead?: ReactNode;
  /** A wider desktop panel, for forms. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 z-40 flex items-end md:items-center md:justify-center md:p-[24px] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      style={{ visibility: open ? "visible" : "hidden", transition: `visibility 0ms linear ${open ? "0ms" : "420ms"}` }}
    >
      <div className="absolute inset-0 bg-[#3A251647] transition-opacity duration-300" style={{ opacity: open ? 1 : 0 }} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative flex flex-col w-full h-[88%] md:h-[min(760px,100%)] ${wide ? "md:max-w-[760px]" : "md:max-w-[560px]"} rounded-t-[30px] md:rounded-[30px] bg-[#FFFCF1] shadow-[0_-12px_40px_rgba(58,37,22,0.18)] md:shadow-[0_24px_60px_-30px_rgba(40,25,16,0.45)] transition-[transform,opacity] duration-[420ms]`}
        style={{ transform: open ? "translateY(0)" : "translateY(104%)", opacity: open ? 1 : 0.6, transitionTimingFunction: EASE }}
      >
        <div className="md:hidden shrink-0 flex justify-center pt-[8px]">
          <span className="w-[38px] h-[5px] rounded-full bg-[#2819101F]" />
        </div>
        <div className="shrink-0 flex items-center gap-[10px] px-[16px] pt-[8px] md:pt-[16px] pb-[12px]">
          {lead}
          <span className="grow min-w-0 flex flex-col pl-[4px]">
            <span className={`${DISPLAY} text-[22px] leading-[26px] tracking-[-0.02em] truncate`}>{title}</span>
            {subtitle && <span className="text-[13px] leading-[18px] text-[#2819109E] truncate">{subtitle}</span>}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#F4EEDF] hover:bg-[#EEE6D6] transition-colors duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="grow min-h-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
