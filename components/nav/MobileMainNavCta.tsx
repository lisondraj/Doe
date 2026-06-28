"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  DESKTOP_NAV_ACTION_SIZE,
  MOBILE_NAV_DROPDOWN_ATTACH_TW,
  MOBILE_NAV_SPLIT_INNER_TW,
  MOBILE_NAV_SPLIT_LINK_TW,
  MOBILE_NAV_SPLIT_SHELL_TW,
  MOBILE_NAV_SPLIT_TOGGLE_TW,
} from "@/lib/subpage/mobile-nav-styles";
import {
  DESKTOP_MAIN_CTA_DROPDOWN_ITEMS,
  DESKTOP_MAIN_CTA_MENU_ITEMS,
} from "@/lib/subpage/subpage-nav";
import { DESKTOP_INVESTORS_CTA_LABEL } from "@/lib/subpage/desktop-nav-styles";

const NAV_CTA_BG = "#000000";
const NAV_CTA_FG = "#ffffff";
const NAV_CTA_DIVIDER = "rgba(255, 255, 255, 0.22)";

/** iPhone nav — investors split button with chevron dropdown. */
export function MobileMainNavCta({
  bg = NAV_CTA_BG,
  fg = NAV_CTA_FG,
  shadow = "none",
  divider = NAV_CTA_DIVIDER,
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
  divider?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const primary = DESKTOP_MAIN_CTA_MENU_ITEMS[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
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

  const dropdownHoverClass =
    fg.toLowerCase() === "#fff" || fg.toLowerCase() === "#ffffff"
      ? "hover:bg-white/10"
      : "hover:bg-black/[0.04]";

  return (
    <div ref={rootRef} className="relative flex shrink-0 items-center">
      <div className={MOBILE_NAV_SPLIT_SHELL_TW} style={{ boxShadow: shadow }}>
        <div className={MOBILE_NAV_SPLIT_INNER_TW}>
          <Link
            href={primary.href}
            className={`${MOBILE_NAV_SPLIT_LINK_TW} no-underline transition-opacity`}
            style={{ backgroundColor: bg, color: fg }}
          >
            {DESKTOP_INVESTORS_CTA_LABEL}
          </Link>
          <button
            type="button"
            className={`${MOBILE_NAV_SPLIT_TOGGLE_TW} transition-opacity`}
            style={{
              backgroundColor: bg,
              color: fg,
              borderColor: divider,
              width: DESKTOP_NAV_ACTION_SIZE,
            }}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Open navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              className="h-[1.125rem] w-[1.125rem] shrink-0 transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : undefined }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {open ? (
          <div
            role="menu"
            className={`${MOBILE_NAV_DROPDOWN_ATTACH_TW} py-1`}
            style={{
              backgroundColor: bg,
              color: fg,
              border: `1px solid ${divider}`,
              boxShadow: shadow === "none" ? "0 8px 24px rgba(0, 0, 0, 0.12)" : shadow,
            }}
          >
            {DESKTOP_MAIN_CTA_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`block px-4 py-2.5 text-sm font-medium no-underline transition-colors ${dropdownHoverClass}`}
                style={{ color: fg }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
