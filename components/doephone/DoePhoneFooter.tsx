"use client";

import Link from "next/link";

import { NAV_HREFS } from "@/components/doe-nav-data";
import { lora } from "@/lib/home/fonts";
import { DESKTOP_FOOTER_GRADIENT, DESKTOP_FOOTER_GRAIN_STYLE } from "@/lib/home/desktop-footer-gradient";

const FOOTER_LINKS = [
  { label: "Features", href: NAV_HREFS.Features },
  { label: "Team", href: NAV_HREFS.Team },
  { label: "Blog", href: NAV_HREFS.Blog },
  { label: "Vision", href: NAV_HREFS["Our Vision"] },
] as const;

export function DoePhoneFooter() {
  return (
    <footer
      className="relative z-10 bg-[#F7F6F3] p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] iphone-page:p-[clamp(1rem,4vmin,1.75rem)] iphone-page:pb-[max(clamp(1rem,4vmin,1.75rem),env(safe-area-inset-bottom,0px))]"
      aria-label="Footer"
    >
      <div
        className="relative mx-auto aspect-square w-full max-w-[min(100%,36rem)] overflow-hidden rounded-2xl iphone-page:max-w-[min(100%,34rem)]"
        style={{ background: DESKTOP_FOOTER_GRADIENT }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={DESKTOP_FOOTER_GRAIN_STYLE}
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col p-5 iphone-page:p-[clamp(1.1rem,4.5vmin,1.65rem)]">
          <nav
            className="ml-auto grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 text-right text-sm font-medium iphone-page:gap-x-6 iphone-page:gap-y-2.5 iphone-page:text-[clamp(0.8125rem,3.2vmin,0.9375rem)]"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white no-underline transition-colors hover:text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative mt-auto flex min-h-0 flex-1 items-end justify-center overflow-hidden pt-4">
            <Link
              href="/"
              className={`pointer-events-auto inline-block shrink-0 text-center font-normal leading-[0.62] tracking-tight text-[#F7F6F3] no-underline transition-opacity hover:opacity-90 ${lora.className}`}
              style={{
                fontSize: "clamp(7.5rem, 52vw, 13.5rem)",
                marginBottom: "-0.12em",
                transform: "translateY(0.06em)",
              }}
            >
              Doe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
