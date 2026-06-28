"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { DOEPHONE_NAV_CTA_BASE } from "@/lib/doephone/waitlist-button";
import {
  DESKTOP_MAIN_CTA_DROPDOWN_ITEMS,
  DESKTOP_MAIN_CTA_MENU_ITEMS,
} from "@/lib/subpage/subpage-nav";
import { MOBILE_INVESTORS_CTA_LABEL } from "@/lib/subpage/desktop-nav-styles";

const MOBILE_NAV_SPLIT_LINK_TW = `${DOEPHONE_NAV_CTA_BASE} rounded-none px-4 text-[1.0625rem] iphone-page:px-[clamp(1.05rem,0.82rem+1.05vmin,1.35rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.82vmin,1.22rem)]`;

const MOBILE_NAV_SPLIT_TOGGLE_TW = `${DOEPHONE_NAV_CTA_BASE} rounded-none border-l border-white/20 px-2.5 iphone-page:px-[clamp(0.55rem,0.42rem+0.55vmin,0.72rem)]`;

/** iPhone nav — investors split button with chevron dropdown. */
export function MobileMainNavCta() {
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
    <div ref={rootRef} className="relative shrink-0">
      <div className="flex items-stretch overflow-visible rounded-[10px] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.86rem)]">
        <div className="flex items-stretch overflow-hidden rounded-[10px] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.86rem)]">
          <Link href={primary.href} className={`${MOBILE_NAV_SPLIT_LINK_TW} no-underline`}>
            {MOBILE_INVESTORS_CTA_LABEL}
          </Link>
          <button
            type="button"
            className={MOBILE_NAV_SPLIT_TOGGLE_TW}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Open navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              className="h-4 w-4 shrink-0 transition-transform duration-200 iphone-page:h-[clamp(0.95rem,0.82rem+0.55vmin,1.1rem)] iphone-page:w-[clamp(0.95rem,0.82rem+0.55vmin,1.1rem)]"
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
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-[9.5rem] overflow-hidden rounded-[10px] bg-black py-1 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.86rem)]"
          >
            {DESKTOP_MAIN_CTA_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 iphone-page:px-[clamp(0.95rem,0.78rem+0.85vmin,1.15rem)] iphone-page:py-[clamp(0.62rem,0.5rem+0.55vmin,0.78rem)] iphone-page:text-[clamp(0.92rem,0.82rem+0.55vmin,1.05rem)]"
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
