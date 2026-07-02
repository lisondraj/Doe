"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { DesktopNavEmailButton } from "@/components/nav/DesktopNavEmailButton";
import { NavEmailCopyDropdown } from "@/components/nav/NavEmailCopyDropdown";
import { PROTO_CONTACT_EMAIL } from "@/lib/proto/proto-desktop-layout-styles";
import { PROTO_INVEST_PATH } from "@/lib/site-domains";
import {
  DESKTOP_NAV_ACTION_HEIGHT_TW,
  DESKTOP_NAV_ACTION_SIZE,
  DESKTOP_INVESTORS_CTA_LABEL,
} from "@/lib/subpage/desktop-nav-styles";
import { NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW } from "@/lib/subpage/nav-email-dropdown-styles";

const DESKTOP_NAV_ACTION_ROW_GAP = "gap-2.5";

/** Desktop /proto nav — mail + For Investors split control. */
export function ProtoDesktopNavActionRow({
  bg = "#ffffff",
  fg = "#000000",
  shadow = "0 2px 6px rgba(0, 0, 0, 0.12)",
  divider = "rgba(0, 0, 0, 0.12)",
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
  divider?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROTO_CONTACT_EMAIL);
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
      <DesktopNavEmailButton bg={bg} fg={fg} shadow={shadow} open={open} onToggle={handleMailToggle} />

      <div className="relative flex items-stretch overflow-visible rounded-md" style={{ boxShadow: shadow }}>
        <div className="flex items-stretch overflow-hidden rounded-md">
          <Link
            href={PROTO_INVEST_PATH}
            className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center px-7 text-[0.9375rem] font-medium no-underline transition-opacity hover:opacity-90`}
            style={{ backgroundColor: bg, color: fg }}
          >
            {DESKTOP_INVESTORS_CTA_LABEL}
          </Link>
          <span
            className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center justify-center border-l`}
            style={{
              backgroundColor: bg,
              color: fg,
              borderColor: divider,
              width: DESKTOP_NAV_ACTION_SIZE,
            }}
            aria-hidden
          >
            <svg
              className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {open ? <NavEmailCopyDropdown copied={copied} attachClassName={NAV_EMAIL_DROPDOWN_ATTACH_RIGHT_TW} /> : null}
    </div>
  );
}
