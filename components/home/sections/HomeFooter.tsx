"use client";

import Link from "next/link";

import { lora } from "@/lib/home/fonts";

export function HomeFooter() {
  return (
    <>
      <footer
        className="relative z-10 mt-0 flex min-h-[min(69vh,42rem)] w-screen flex-col justify-end overflow-x-clip overflow-y-visible pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] iphone-page:min-h-[66vh]"
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
        <div className="relative z-10 flex w-full flex-1 flex-col justify-end px-3 pt-10 md:px-6 md:pt-16 iphone-page:px-0">
          <nav
            className="mx-auto mb-14 grid w-[min(100%,17rem)] shrink-0 grid-cols-2 justify-items-center gap-x-5 gap-y-4 text-center text-[clamp(1.15rem,4.25vw,1.5rem)] font-medium tracking-tight md:mb-16 md:w-[min(100%,22rem)] md:gap-x-8 md:gap-y-5 md:text-[clamp(1.25rem,2.8vw,1.75rem)] iphone-page:mb-12 iphone-page:max-w-[16rem] iphone-page:gap-x-4 iphone-page:gap-y-3.5 iphone-page:text-[clamp(1.2rem,4.8vmin,1.65rem)]"
            aria-label="Footer"
          >
            <Link href="/features" className="text-white no-underline transition-colors hover:text-white/85">
              Features
            </Link>
            <Link href="/blog" className="text-white no-underline transition-colors hover:text-white/85">
              Blog
            </Link>
            <Link href="/" className="text-white no-underline transition-colors hover:text-white/85">
              Team
            </Link>
            <Link href="/" className="text-white no-underline transition-colors hover:text-white/85">
              Our Vision
            </Link>
          </nav>
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
                transform: "translateY(min(1vh, 0.5rem))",
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
