"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  doePhoneRevealLiftClass,
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";

type RevealSegment =
  | "title"
  | "carousel"
  | "menu"
  | "badge"
  | "input"
  | "agents-carousel"
  | "agents-peek"
  | "agents-orbs"
  | "agents-label"
  | "agents-nav";

/** Applies unblur + rise classes to content — backgrounds stay outside this wrapper. */
export function DoePhoneScrollRevealContent({
  children,
  className = "",
  hoverable = true,
  revealed,
  segment,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  revealed: boolean;
  segment?: RevealSegment;
}) {
  const revealClass = segment
    ? doePhoneSectionRevealSegmentClass(segment, revealed, hoverable)
    : doePhoneRevealLiftClass(revealed, hoverable);

  return <div className={`${revealClass}${className ? ` ${className}` : ""}`}>{children}</div>;
}

/** Scroll observer + content reveal — use inside sections, not on section shells. */
export function DoePhoneScrollRevealLift({
  children,
  className = "",
  hoverable = true,
  threshold = 0.18,
  skipInitialReveal = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  threshold?: number;
  skipInitialReveal?: boolean;
  style?: CSSProperties;
}) {
  const { ref, revealed } = useDoePhoneSectionReveal(threshold, { skipInitialReveal });

  return (
    <div ref={ref} className={className} style={style}>
      <div className={doePhoneRevealLiftClass(revealed, hoverable)}>{children}</div>
    </div>
  );
}
