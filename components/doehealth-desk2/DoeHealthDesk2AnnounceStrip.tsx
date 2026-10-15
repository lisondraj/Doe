"use client";

import Link from "next/link";

import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { DOEHEALTH_DESK2_ANNOUNCEMENT } from "@/lib/doehealthdesk2/doehealthdesk2-nav-copy";
import { inter } from "@/lib/home/fonts";

type DoeHealthDesk2AnnounceStripProps = {
  onDismiss: () => void;
  /** iPhone — short label beside Learn more. */
  compact?: boolean;
};

/** Pre-seed strip above desk nav — desktop and iPhone. */
export function DoeHealthDesk2AnnounceStrip({ onDismiss, compact = false }: DoeHealthDesk2AnnounceStripProps) {
  return (
    <div className={`doehealth-desk2-announce ${inter.className}`}>
      <p>
        <span>{compact ? DOEHEALTH_DESK2_ANNOUNCEMENT.phoneMessage : DOEHEALTH_DESK2_ANNOUNCEMENT.message}</span>
        <Link href={DOEHEALTH_DESK2_ANNOUNCEMENT.href} className="doehealth-desk2-announce__link">
          {DOEHEALTH_DESK2_ANNOUNCEMENT.linkLabel}
          <DoeLinkArrow className="doehealth-desk2-announce__arrow" width={13} height={13} />
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
