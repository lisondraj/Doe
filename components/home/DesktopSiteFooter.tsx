"use client";

import Link from "next/link";

import { NAV_HREFS } from "@/components/doe-nav-data";
import { lora } from "@/lib/home/fonts";
import { JOIN_DESKTOP_CONTENT } from "@/lib/join/join-layout";

const DESKTOP_FOOTER_LINKS = [
  { label: "Features", href: NAV_HREFS.Features },
  { label: "Team", href: NAV_HREFS.Team },
  { label: "Blog", href: NAV_HREFS.Blog },
  { label: "Vision", href: NAV_HREFS["Our Vision"] },
] as const;

const FOOTER_GRADIENT = `
  radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
  radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  linear-gradient(to right, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%),
  linear-gradient(to left, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%)
`;

export function DesktopSiteFooter({ linksDisabled = false }: { linksDisabled?: boolean }) {
  return (
    <div className={`${JOIN_DESKTOP_CONTENT} pb-8`}>
      <div
        className="relative flex min-h-[160px] items-center overflow-hidden rounded-2xl py-20"
        style={{ background: FOOTER_GRADIENT }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 1,
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative z-10 flex w-full items-center justify-between">
          {linksDisabled ? (
            <h2 className={`text-4xl font-normal text-white ${lora.className}`}>Doe</h2>
          ) : (
            <Link href="/" className={`text-4xl font-normal text-white no-underline ${lora.className}`}>
              Doe
            </Link>
          )}

          <nav className="ml-auto grid grid-cols-2 gap-x-12 gap-y-4" aria-label="Footer">
            {DESKTOP_FOOTER_LINKS.map((item) =>
              linksDisabled ? (
                <span key={item.label} className="text-sm font-medium text-white">
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-white no-underline transition-colors hover:text-white/80"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
