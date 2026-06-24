"use client";

import Link from "next/link";

import { DOEPHONE_FOOTER_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

const FOOTER_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/", label: "Team" },
  { href: "/", label: "Our Vision" },
] as const;

export function HomeFooter({ linksDisabled = false }: { linksDisabled?: boolean }) {
  return (
    <>
      <footer
        className="relative z-10 mt-0 flex min-h-[min(69vh,42rem)] w-screen flex-col justify-end overflow-x-clip overflow-y-hidden pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] iphone-page:min-h-[66vh]"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        {/* Base — warm amber / teak blend consistent with hero & bento oranges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(152deg, #1a2e34 0%, #243a40 14%, #3d2f28 32%, #6b442f 48%, #a85a34 62%, #d4893f 76%, #e8b04d 88%, #f2cf7a 100%),
              radial-gradient(ellipse 100% 80% at 50% 110%, rgba(231, 169, 68, 0.55) 0%, transparent 58%),
              radial-gradient(ellipse 55% 45% at 12% 18%, rgba(255, 224, 180, 0.22) 0%, transparent 52%),
              radial-gradient(ellipse 50% 40% at 88% 22%, rgba(210, 119, 76, 0.3) 0%, transparent 55%)
            `,
          }}
        />
        {/* Line mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: 0.55,
            mixBlendMode: "soft-light",
            backgroundImage: `
              repeating-linear-gradient(
                -32deg,
                transparent 0px,
                transparent 11px,
                rgba(255, 255, 255, 0.09) 11px,
                rgba(255, 255, 255, 0.09) 12px
              ),
              repeating-linear-gradient(
                32deg,
                transparent 0px,
                transparent 15px,
                rgba(30, 52, 58, 0.14) 15px,
                rgba(30, 52, 58, 0.14) 16px
              )
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 1,
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative z-10 flex w-full flex-1 flex-col justify-end pt-10 md:pt-16">
          <div
            className={`mb-14 flex w-full items-end justify-between gap-8 md:mb-16 iphone-page:mb-12 iphone-page:gap-6 ${DOEPHONE_FOOTER_CONTENT_INSET}`}
          >
            <div
              className={`min-w-0 shrink text-left text-white ${inter.className} text-[clamp(1.28rem,1.1rem+0.75vmin,1.55rem)] font-normal leading-[1.38] tracking-[-0.01em] iphone-page:text-[clamp(1.2rem,1.05rem+0.68vmin,1.45rem)]`}
            >
              <p className="text-[clamp(1.45rem,1.22rem+0.85vmin,1.75rem)] font-semibold leading-[1.16] iphone-page:text-[clamp(1.35rem,1.15rem+0.78vmin,1.62rem)]">
                Doe Corporation
              </p>
              <address className="mt-2.5 space-y-0.5 not-italic text-white/88">
                <span className="block">250 Hudson Street</span>
                <span className="block">New York, NY 10013</span>
                <span className="block">United States</span>
              </address>
              <a
                href="mailto:contact@doe.care"
                className="mt-2.5 inline-block text-white/88 no-underline transition-colors hover:text-white"
              >
                contact@doe.care
              </a>
            </div>

            <nav
              className="flex shrink-0 flex-col items-end gap-4 text-right text-[clamp(1.48rem,5vw,2.1rem)] font-medium leading-[1.1] tracking-tight md:gap-4.5 md:text-[clamp(1.58rem,3vw,2.25rem)] iphone-page:gap-3.5 iphone-page:text-[clamp(1.38rem,4.8vmin,1.82rem)]"
              aria-label="Footer"
            >
              {FOOTER_LINKS.map((item) =>
                linksDisabled ? (
                  <span key={item.label} className="text-white">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white no-underline transition-colors hover:text-white/85"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div
            className="relative z-[11] flex justify-center overflow-x-clip overflow-y-visible pt-3 pb-0"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <Link
              href="/"
              className={`pointer-events-auto inline-block shrink-0 text-center font-normal leading-[0.65] tracking-tight no-underline transition-opacity hover:opacity-90 ${lora.className}`}
              style={{
                color: "#F7F6F3",
                /** Giant: wide enough that “d” / “e” bleed past L/R edges; milder bottom bleed. */
                fontSize: "clamp(11rem, min(76vw, 68vmin), 30rem)",
                marginBottom: "calc(-0.06em - env(safe-area-inset-bottom, 0px))",
              }}
            >
              Doe
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
