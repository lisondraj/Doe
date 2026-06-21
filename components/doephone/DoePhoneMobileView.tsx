"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { inter, lora } from "@/lib/home/fonts";
import { HERO_BACKDROP_GRADIENT, narrowHorizontalInset } from "@/lib/home/hero-constants";
import { useLayoutEffect } from "react";

export function DoePhoneMobileView() {
  /** Layout viewport only — ignore visualViewport shrink during pinch so layout stays stable. */
  useLayoutEffect(() => {
    const measure = () => {
      document.documentElement.style.setProperty("--app-vw", `${window.innerWidth}px`);
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />

      <section className="relative min-h-[100dvh] w-full overflow-hidden" aria-label="Hero">
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
  );
}
