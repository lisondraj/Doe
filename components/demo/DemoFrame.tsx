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
}: {
  children: ReactNode;
  /** Sits opposite the Doe mark in the top bar. */
  right?: ReactNode;
  /** Drawn over the box's content but inside its rounded edge (sheets, drawers). */
  overlay?: ReactNode;
  logoHref?: string;
}) {
  const mark = <span className={`${lora.className} text-[26px] leading-[30px] font-[600] tracking-[-0.01em] text-[#281910]`}>Doe</span>;
  return (
    <div
      className={`${dmSans.className} doehealth-product-page fixed inset-0 bg-[#140C04] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          <header className="sticky top-0 z-30 flex items-center justify-between h-[64px] md:h-[72px] px-[22px] md:px-[32px] bg-[#FFFCF1E6] backdrop-blur-[12px]">
            {logoHref ? (
              <Link href={logoHref} aria-label="Doe">
                {mark}
              </Link>
            ) : (
              mark
            )}
            {right}
          </header>
          {children}
        </div>
        {overlay}
      </div>
    </div>
  );
}

export function Check({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center rounded-[7px] transition-colors duration-150"
      style={{
        width: size,
        height: size,
        backgroundColor: on ? "#140C04" : "transparent",
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
