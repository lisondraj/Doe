"use client";

import Link from "next/link";

import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { DOE_FALL26_DESK_ANNOUNCEMENT } from "@/lib/doefall26/doefall26-desk-nav-copy";
import { inter } from "@/lib/home/fonts";

type DoeFall26DeskAnnounceStripProps = {
  onDismiss: () => void;
  /** iPhone — short label beside Learn more. */
  compact?: boolean;
};

/** Pre-seed strip above desk nav — desktop and iPhone. */
export function DoeFall26DeskAnnounceStrip({ onDismiss, compact = false }: DoeFall26DeskAnnounceStripProps) {
  return (
    <div className={`doefall26-desk-announce ${inter.className}`}>
      <p>
        <span>{compact ? DOE_FALL26_DESK_ANNOUNCEMENT.phoneMessage : DOE_FALL26_DESK_ANNOUNCEMENT.message}</span>
        <Link href={DOE_FALL26_DESK_ANNOUNCEMENT.href} className="doefall26-desk-announce__link">
          {DOE_FALL26_DESK_ANNOUNCEMENT.linkLabel}
          <DoeLinkArrow className="doefall26-desk-announce__arrow" width={13} height={13} />
        </Link>
      </p>
      <button type="button" aria-label="Dismiss announcement" onClick={onDismiss}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
