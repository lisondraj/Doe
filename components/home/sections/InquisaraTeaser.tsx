"use client";

import { inter } from "@/lib/home/fonts";
import { VBENTO_CANVAS_PADDING } from "@/lib/home/hero-constants";

export function InquisaraTeaser() {
  return (
    <>
      {/* Inquisara — Prior-auth slide shell: 90° teal→gold gradient, grain + wave lines (distinct from other slides); no heading shadow */}
      <div className={`relative z-10 w-full pb-[clamp(0.85rem,2.75vw,1.35rem)] ${VBENTO_CANVAS_PADDING}`}>
        <section
          aria-labelledby="inquisara-teaser-heading"
          className="relative mx-auto w-full max-w-full overflow-hidden rounded-[clamp(0.9rem,2.1vw,1.35rem)] ring-1 ring-white/15"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                background:
                  "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
                opacity: 1,
                mixBlendMode: "overlay",
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 700 700"
                preserveAspectRatio="none"
                aria-hidden
              >
                {Array.from({ length: 12 }, (_, w) => (
                  <path
                    key={`inquisara-wave-${w}`}
                    d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>
          <div className="relative z-10 mx-auto flex min-h-[min(41vw,17rem)] w-full max-w-full flex-col items-center justify-center px-4 py-[clamp(2rem,5.65vw,3.95rem)] text-center md:min-h-[min(37vw,15.75rem)] md:px-6 iphone-page:px-4 iphone-page:py-[clamp(1.85rem,7.25vw,3.65rem)]">
            <h2
              id="inquisara-teaser-heading"
              className={`font-normal tracking-tight text-white ${inter.className}`}
              style={{
                fontSize: "clamp(2rem, min(8.5vw, 9.5vmin), 3.85rem)",
                lineHeight: 1.06,
              }}
            >
              Inquisara
            </h2>
            <a
              href="https://inquisara.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See what we are building (opens in new tab)"
              className={`mt-[clamp(0.65rem,2vw,1.05rem)] inline-flex items-center gap-2.5 text-[clamp(1.02rem,2.95vw,1.325rem)] font-medium tracking-tight text-white underline decoration-white/75 underline-offset-[0.26em] transition-[opacity,decoration-color] hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90 ${inter.className}`}
            >
              <span className="text-white">See what we&apos;re building</span>
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white translate-y-[0.5px]"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
