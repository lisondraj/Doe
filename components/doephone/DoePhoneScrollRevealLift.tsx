"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  doePhoneRevealLiftClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";

/** Scroll-triggered unblur + rise with optional hover lift — content below the home hero. */
export function DoePhoneScrollRevealLift({
  children,
  className = "",
  hoverable = true,
  threshold = 0.08,
  style,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  threshold?: number;
  style?: CSSProperties;
}) {
  const { ref, revealed } = useDoePhoneSectionReveal(threshold);

  return (
    <div
      ref={ref}
      className={`doephone-scroll-reveal-lift ${doePhoneRevealLiftClass(revealed, hoverable)}${
        className ? ` ${className}` : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
}
