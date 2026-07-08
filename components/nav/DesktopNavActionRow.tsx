"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { DesktopMainNavCta } from "@/components/home/DesktopMainNavCta";
import { DesktopNavEmailButton } from "@/components/nav/DesktopNavEmailButton";
import { NavEmailCopyDropdown } from "@/components/nav/NavEmailCopyDropdown";
import { NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW } from "@/lib/subpage/nav-email-dropdown-styles";

const DESKTOP_NAV_ACTION_ROW_GAP = "gap-2.5";

/** Desktop nav — mail + investors row with right-aligned email copy dropdown. */
export function DesktopNavActionRow({
  bg = "#000000",
  fg = "#ffffff",
  shadow = "none",
  divider = "rgba(255, 255, 255, 0.22)",
  linksEnabled = true,
  punched = false,
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
  divider?: string;
  linksEnabled?: boolean;
  /** Match iPhone punched capsule — sand pills, pill radius. */
  punched?: boolean;
}) {
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
    <div ref={rowRef} className={`relative flex shrink-0 items-center ${DESKTOP_NAV_ACTION_ROW_GAP}`}>
      <DesktopNavEmailButton
        bg={bg}
        fg={fg}
        shadow={shadow}
        punched={punched}
        open={open}
        onToggle={handleMailToggle}
      />

      <DesktopMainNavCta
        bg={bg}
        fg={fg}
        shadow={shadow}
        divider={divider}
        punched={punched}
        linksEnabled={linksEnabled}
      />

      {open ? <NavEmailCopyDropdown copied={copied} attachClassName={NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW} /> : null}
    </div>
  );
}
