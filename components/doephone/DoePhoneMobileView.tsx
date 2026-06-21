"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { inter, lora } from "@/lib/home/fonts";
import { HERO_BACKDROP_GRADIENT, narrowHorizontalInset } from "@/lib/home/hero-constants";
import { useLayoutEffect, useState } from "react";

function appViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

export function DoePhoneMobileView() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [heroHeightPx, setHeroHeightPx] = useState(800);

  useLayoutEffect(() => {
    const measure = () => {
      const { width, height } = appViewportPx();
      setViewportWidth(width);
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
      const rootZoom = doeforvcRootZoom(width);
      const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;
      setHeroHeightPx(Math.round(applyRootZoom ? height / rootZoom : height));
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
        data-doeforvc-view="iphone"
      >
        {/* Hero — same gradient stack as home */}
        <section
          className="relative w-full overflow-hidden"
          style={{ minHeight: `${heroHeightPx}px`, height: `${heroHeightPx}px` }}
          aria-label="Hero"
        >
          <div className="absolute inset-0">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: HERO_BACKDROP_GRADIENT }}
              aria-hidden
            />
            <HeroCarouselTextureOverlay />
          </div>
        </section>

        <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

        {/* First section — beige band below hero */}
        <section
          className={`relative z-10 w-full bg-[#F7F6F3] px-4 py-16 iphone-page:py-20 ${narrowHorizontalInset}`}
        >
          <div className="mx-auto w-full max-w-full text-center">
            <h1
              className={`flex flex-col items-center gap-2 font-normal text-gray-900 tracking-tight ${lora.className}`}
            >
              <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                Doe Phone
              </span>
            </h1>
            <p
              className={`mx-auto mt-5 max-w-[20rem] text-[clamp(1.05rem,3.8vw,1.2rem)] font-medium leading-[1.45] tracking-tight text-gray-600 ${inter.className}`}
            >
              Mobile-first experience — more coming soon.
            </p>
          </div>
        </section>

        <HomeFooter />
      </div>
    </>
  );
}
