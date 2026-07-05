"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { MobileMainNavCta } from "@/components/nav/MobileMainNavCta";
import { MobileNavEmailButton } from "@/components/nav/MobileNavEmailButton";
import { NavEmailCopyDropdown } from "@/components/nav/NavEmailCopyDropdown";
import { NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW } from "@/lib/subpage/nav-email-dropdown-styles";

const MOBILE_NAV_ACTION_ROW_GAP =
  "gap-3 iphone-page:gap-[clamp(0.55rem,0.42rem+0.72vmin,0.82rem)]";

export type MobileNavActionChrome = {
  bg?: string;
  fg?: string;
  shadow?: string;
  divider?: string;
};

/** iPhone nav — mail icon + investors split button. */
export function MobileNavActionRow({
  bg,
  fg,
  shadow,
  divider,
  linksEnabled = true,
  investorsHref,
}: MobileNavActionChrome & { linksEnabled?: boolean; investorsHref?: string } = {}) {
  const chrome = { bg, fg, shadow, divider };
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_CONTACT_EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleMailToggle = useCallback(async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      await copyEmail();
    }
  }, [copyEmail, open]);

  return (
    <div
      ref={rowRef}
      className={`relative flex shrink-0 items-center ${MOBILE_NAV_ACTION_ROW_GAP}${open ? " proto-nav-action-row--open" : ""}`}
    >
      <MobileNavEmailButton {...chrome} open={open} onToggle={handleMailToggle} />
      <MobileMainNavCta {...chrome} linksEnabled={linksEnabled} investorsHref={investorsHref} />
      {open ? (
        <NavEmailCopyDropdown
          copied={copied}
          attachClassName={NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW}
          bg={bg}
          fg={fg}
          divider={divider}
        />
      ) : null}
    </div>
  );
}
