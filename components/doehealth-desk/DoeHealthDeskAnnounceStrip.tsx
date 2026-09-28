"use client";

import Link from "next/link";

import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { DOEHEALTH_DESK_ANNOUNCEMENT } from "@/lib/doehealth/doehealth-desk-nav-copy";
import { inter } from "@/lib/home/fonts";

type DoeHealthDeskAnnounceStripProps = {
  onDismiss: () => void;
};

/** Pre-seed strip above desk nav — desktop and iPhone. */
export function DoeHealthDeskAnnounceStrip({ onDismiss }: DoeHealthDeskAnnounceStripProps) {
  return (
    <div className={`doehealth-desk-announce ${inter.className}`}>
      <p>
        <span>{DOEHEALTH_DESK_ANNOUNCEMENT.message}</span>
        <Link href={DOEHEALTH_DESK_ANNOUNCEMENT.href} className="doehealth-desk-announce__link">
          {DOEHEALTH_DESK_ANNOUNCEMENT.linkLabel}
          <DoeLinkArrow className="doehealth-desk-announce__arrow" width={13} height={13} />
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
