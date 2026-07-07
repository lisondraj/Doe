"use client";

import Link from "next/link";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { DOEPHONE_FOOTER_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import { doeHomeFooterShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const FOOTER_SHADER = doeHomeFooterShaderSurface();

const FOOTER_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/", label: "Team" },
  { href: "/", label: "Our Vision" },
] as const;

export function HomeFooter({
  linksDisabled = false,
  shaderSurface,
}: {
  linksDisabled?: boolean;
  shaderSurface?: ProtoGrainGradientSurface;
}) {
  const footerShader = shaderSurface ?? FOOTER_SHADER;
  return (
    <>
      <footer
        className="relative z-10 mt-0 flex min-h-[min(69vh,42rem)] w-screen flex-col justify-end overflow-x-clip overflow-y-hidden bg-[#1E343A] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] iphone-page:min-h-[66vh]"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <ProtoGrainGradient
            variant={footerShader.variant}
            colors={footerShader.colors}
            colorBack={footerShader.colorBack}
            static
          />
        </div>

        <div className="relative z-10 flex w-full flex-1 flex-col justify-end pt-10 md:pt-16">
          <div
            className={`mb-14 flex w-full items-end justify-between gap-8 md:mb-16 iphone-page:mb-12 iphone-page:gap-6 ${DOEPHONE_FOOTER_CONTENT_INSET}`}
          >
            <div
              className={`home-footer-contact min-w-0 shrink text-left text-white ${inter.className} text-[clamp(1.08rem,0.92rem+0.62vmin,1.32rem)] font-normal leading-[1.38] tracking-[-0.01em] iphone-page:text-[clamp(1.02rem,0.88rem+0.56vmin,1.22rem)]`}
            >
              <p className="text-[clamp(1.22rem,1.02rem+0.72vmin,1.48rem)] font-semibold leading-[1.16] iphone-page:text-[clamp(1.14rem,0.98rem+0.65vmin,1.36rem)]">
                Doe Corporation
              </p>
              <address className="mt-2.5 space-y-0.5 not-italic text-white/88">
                <span className="block">250 Hudson Street</span>
                <span className="block">New York, NY 10013</span>
                <span className="block">United States</span>
              </address>
              <a
                href="mailto:ask@doehealth.care"
                className="mt-2.5 inline-block text-white/88 no-underline transition-colors hover:text-white"
              >
                ask@doehealth.care
              </a>
            </div>

            <nav
              className="home-footer-links flex shrink-0 flex-col items-end gap-3 text-right text-[clamp(1.22rem,4.15vw,1.75rem)] font-medium leading-[1.1] tracking-tight md:gap-3.5 md:text-[clamp(1.32rem,2.5vw,1.88rem)] iphone-page:gap-2.5 iphone-page:text-[clamp(1.12rem,4.05vmin,1.52rem)]"
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
                color: "#F2ECE4",
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
