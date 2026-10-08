"use client";

import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { usePremedLearnMoreModal } from "@/components/premed/PremedLearnMoreProvider";
import { DOECAREFALL26_DESK_ANNOUNCEMENT } from "@/lib/doecarefall26/doecarefall26-desk-nav-copy";
import { inter } from "@/lib/home/fonts";

type DoeCareFall26DeskAnnounceStripProps = {
  onDismiss: () => void;
  /** iPhone — short label beside Learn more. */
  compact?: boolean;
};

/** Pre-seed strip above desk nav — desktop and iPhone. */
export function DoeCareFall26DeskAnnounceStrip({ onDismiss, compact = false }: DoeCareFall26DeskAnnounceStripProps) {
  const { openLearnMoreModal } = usePremedLearnMoreModal();

  return (
    <div className={`doecarefall26-desk-announce ${inter.className}`}>
      <p>
        <span>{compact ? DOECAREFALL26_DESK_ANNOUNCEMENT.phoneMessage : DOECAREFALL26_DESK_ANNOUNCEMENT.message}</span>
        <a
          href="#contact"
          className="doecarefall26-desk-announce__link"
          onClick={(event) => {
            event.preventDefault();
            openLearnMoreModal();
          }}
        >
          {DOECAREFALL26_DESK_ANNOUNCEMENT.linkLabel}
          <DoeLinkArrow className="doecarefall26-desk-announce__arrow" width={13} height={13} />
        </a>
      </p>
      <button type="button" aria-label="Dismiss announcement" data-carefall26-allow onClick={onDismiss}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
