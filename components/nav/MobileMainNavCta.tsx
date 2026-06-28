"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
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

const NAV_CTA_DIVIDER = "rgba(255, 255, 255, 0.22)";

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
    <div ref={rootRef} className="relative flex shrink-0 items-center">
      <div className={MOBILE_NAV_SPLIT_SHELL_TW}>
        <div className={MOBILE_NAV_SPLIT_INNER_TW}>
          <Link href={primary.href} className={`${MOBILE_NAV_SPLIT_LINK_TW} no-underline`}>
            {DESKTOP_INVESTORS_CTA_LABEL}
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
              className="h-[1.125rem] w-[1.125rem] shrink-0 transition-transform duration-200 iphone-page:h-[clamp(1.05rem,0.92rem+0.65vmin,1.22rem)] iphone-page:w-[clamp(1.05rem,0.92rem+0.65vmin,1.22rem)]"
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
            className={`${MOBILE_NAV_DROPDOWN_ATTACH_TW} bg-black py-1 text-white`}
            style={{
              border: `1px solid ${NAV_CTA_DIVIDER}`,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            }}
          >
            {DESKTOP_MAIN_CTA_DROPDOWN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 iphone-page:px-[clamp(1rem,0.82rem+0.9vmin,1.2rem)] iphone-page:py-[clamp(0.72rem,0.58rem+0.62vmin,0.88rem)] iphone-page:text-[clamp(0.95rem,0.86rem+0.58vmin,1.08rem)]"
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
