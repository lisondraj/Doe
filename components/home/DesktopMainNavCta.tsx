"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  DESKTOP_MAIN_CTA_DROPDOWN_ITEMS,
  DESKTOP_MAIN_CTA_MENU_ITEMS,
} from "@/lib/subpage/subpage-nav";

export function DesktopMainNavCta({
  bg,
  fg,
  shadow,
  divider,
}: {
  bg: string;
  fg: string;
  shadow: string;
  divider: string;
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

  return (
    <div ref={rootRef} className="relative flex shrink-0 items-center">
      <div className="relative flex items-stretch overflow-visible rounded-md" style={{ boxShadow: shadow }}>
        <div className="flex items-stretch overflow-hidden rounded-md">
          <Link
            href={primary.href}
            className="flex items-center px-6 py-2.5 text-sm font-medium no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: bg, color: fg }}
          >
            {primary.label}
          </Link>
          <button
            type="button"
            className="flex items-center justify-center border-l px-2.5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: bg, color: fg, borderColor: divider }}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Open navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              className="h-4 w-4 shrink-0 transition-transform duration-200"
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
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-md border border-[#E6E6E6] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            {DESKTOP_MAIN_CTA_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-medium text-black no-underline transition-colors hover:bg-black/[0.04]"
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
