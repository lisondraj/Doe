"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  DESKTOP_MAIN_CTA_DROPDOWN_ITEMS,
  DESKTOP_MAIN_CTA_MENU_ITEMS,
} from "@/lib/subpage/subpage-nav";
import {
  DESKTOP_NAV_ACTION_HEIGHT_TW,
  DESKTOP_NAV_ACTION_SIZE,
} from "@/lib/subpage/desktop-nav-styles";

export function DesktopMainNavCta({
  bg,
  fg,
  shadow,
  divider,
  linksEnabled = true,
  punched = false,
}: {
  bg: string;
  fg: string;
  shadow: string;
  divider: string;
  linksEnabled?: boolean;
  punched?: boolean;
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

  const radius = punched ? "rounded-full" : "rounded-md";

  return (
    <div ref={rootRef} className="relative flex shrink-0 items-center">
      <div
        className={`relative flex items-stretch overflow-visible ${radius}${punched ? " proto-nav-cta-shell" : ""}`}
        style={{ boxShadow: shadow }}
      >
        <div className={`flex items-stretch overflow-hidden ${radius}`}>
          {linksEnabled ? (
            <Link
              href={primary.href}
              className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center px-7 text-[0.9375rem] font-medium proto-nav-cta-label no-underline transition-opacity hover:opacity-90`}
              style={{ backgroundColor: bg, color: fg }}
            >
              {primary.label}
            </Link>
          ) : (
            <span
              className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center px-7 text-[0.9375rem] font-medium proto-nav-cta-label`}
              style={{ backgroundColor: bg, color: fg }}
              aria-disabled="true"
            >
              {primary.label}
            </span>
          )}
          <button
            type="button"
            className={`flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} items-center justify-center border-l proto-nav-cta-label transition-opacity hover:opacity-90`}
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
            className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden py-1 ${radius}`}
            style={{
              backgroundColor: bg,
              color: fg,
              border: `1px solid ${divider}`,
              boxShadow: shadow === "none" ? "0 8px 24px rgba(0, 0, 0, 0.12)" : shadow,
            }}
          >
            {DESKTOP_MAIN_CTA_DROPDOWN_ITEMS.map((item) =>
              linksEnabled ? (
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
              ) : (
                <span
                  key={item.href}
                  role="menuitem"
                  className={`block px-4 py-2.5 text-sm font-medium ${dropdownHoverClass}`}
                  style={{ color: fg }}
                >
                  {item.label}
                </span>
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
