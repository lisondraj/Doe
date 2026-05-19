"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { FEATURE_PAGE_SECTIONS } from "@/components/doe-nav-data";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { useDisablePinchGestures } from "@/lib/useDisablePinchGestures";
import { Inter, Lora } from "next/font/google";
import { useLayoutEffect, useState } from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function appViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

const narrowHorizontalInset =
  "iphone-page:pl-[max(2rem,calc(env(safe-area-inset-left,0px)+1.5rem))] iphone-page:pr-[max(2rem,calc(env(safe-area-inset-right,0px)+1.5rem))]";

function FeatureVisual({ gradient }: { gradient: string }) {
  return (
    <div
      className="relative w-full min-h-[min(44vh,24rem)] iphone-page:min-h-[min(48dvh,26rem)] overflow-hidden rounded-[1.5rem] iphone-page:rounded-[clamp(1.35rem,1.1rem+1.5vmin,2rem)] shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: gradient }} />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          mixBlendMode: "soft-light",
          backgroundImage: `
            repeating-linear-gradient(
              -32deg,
              transparent 0px,
              transparent 11px,
              rgba(255, 255, 255, 0.12) 11px,
              rgba(255, 255, 255, 0.12) 12px
            ),
            repeating-linear-gradient(
              32deg,
              transparent 0px,
              transparent 15px,
              rgba(30, 52, 58, 0.18) 15px,
              rgba(30, 52, 58, 0.18) 16px
            )`,
        }}
      />
    </div>
  );
}

export default function FeaturesPage() {
  useDisablePinchGestures();

  const [viewportWidth, setViewportWidth] = useState(1200);

  useLayoutEffect(() => {
    const measure = () => {
      const { width, height } = appViewportPx();
      setViewportWidth(width);
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, []);

  const rootZoom = doeforvcRootZoom(viewportWidth);
  const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;

  return (
    <>
      <DoeIphoneSiteNav />

      <div
        className="relative z-0 min-h-[100dvh] overflow-x-hidden doeforvc-iphone-root"
        style={{
          backgroundColor: "#F7F6F3",
          ...(applyRootZoom ? { zoom: rootZoom } : {}),
        }}
        suppressHydrationWarning
      >
        <main
          className={`relative z-0 w-full max-w-[min(100%,52rem)] mx-auto pt-[5.5rem] iphone-page:pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4rem))] pb-20 iphone-page:pb-24 ${narrowHorizontalInset}`}
        >
          <header className="mt-8 iphone-page:mt-10 mb-12 iphone-page:mb-14">
            <p
              className={`text-[clamp(0.75rem,2.8vw,0.875rem)] font-medium uppercase tracking-[0.2em] text-gray-500 mb-4 ${inter.className}`}
            >
              Platform
            </p>
            <h1
              className={`text-[clamp(2.35rem,8vw,3.75rem)] iphone-page:text-[clamp(2.5rem,8.5vw,4rem)] text-gray-900 tracking-tight leading-[1.08] ${lora.className}`}
            >
              Features
            </h1>
            <p
              className={`mt-5 max-w-[36rem] text-[clamp(1.1rem,3.9vw,1.3rem)] iphone-page:text-[clamp(1.2rem,4.25vw,1.4rem)] leading-[1.55] text-gray-700 font-medium ${inter.className}`}
            >
              Orchestration across inbox, finance, clinical reasoning, and education—without
              ripping out the systems you already run on.
            </p>
          </header>

          <div className="space-y-14 iphone-page:space-y-16">
            {FEATURE_PAGE_SECTIONS.map((section, i) => (
              <article
                key={section.label}
                className={
                  i > 0
                    ? "pt-14 iphone-page:pt-16 border-t border-[#E6E6E6]"
                    : undefined
                }
              >
                <FeatureVisual gradient={section.gradient} />
                <div className="mt-8 iphone-page:mt-10 space-y-4 iphone-page:space-y-5">
                  <p
                    className={`text-[clamp(0.75rem,2.8vw,0.875rem)] font-medium uppercase tracking-[0.2em] text-gray-500 ${inter.className}`}
                  >
                    {section.label}
                  </p>
                  <h2
                    className={`text-[clamp(1.85rem,6vw,2.75rem)] iphone-page:text-[clamp(2rem,6.5vw,3rem)] text-gray-900 tracking-tight leading-[1.12] ${lora.className}`}
                  >
                    {section.title}
                  </h2>
                  <p
                    className={`text-[clamp(1.1rem,3.9vw,1.3rem)] iphone-page:text-[clamp(1.2rem,4.25vw,1.4rem)] leading-[1.65] text-gray-800 font-normal ${inter.className}`}
                  >
                    {section.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
