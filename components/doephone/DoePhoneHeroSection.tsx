"use client";

import { DoePhoneHeroGradientCircles } from "@/components/doephone/DoePhoneHeroGradientCircles";
import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { ProtoHomeHeroGradient } from "@/components/proto/ProtoHomeHeroGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_HERO_INTRO_GRADIENT_MS,
  DOEPHONE_HERO_INTRO_GRADIENT_START,
  doephoneHeroIntroStyleVars,
} from "@/lib/doephone/hero-intro-timing";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_LEFT,
  DOEPHONE_HERO_COPY_INSET,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { PROTO_HERO_HEIGHT } from "@/lib/proto/proto-hero-layout";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import { PROTO_RECEPTION_PALETTE } from "@/lib/proto/proto-communication-gradients";
import {
  DOE_HOME_HERO_REEF_PALETTE,
  doeHomeHeroReefShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { useEffect, useState, type CSSProperties } from "react";

/** Hero — slightly below full viewport so Safari bottom bar does not clip; section 2 stays full height. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(var(--app-vh,100lvh)*0.88 + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

const DOEPHONE_HERO_DESKTOP_HEIGHT = "100dvh";

export function DoePhoneHeroSection({
  variant = "mobile",
  proto = false,
  iphoneBackdrop = false,
}: {
  /** Desktop home uses full viewport height and wider copy gutters. */
  variant?: "mobile" | "desktop";
  /** Proto landing — dark palette and hiring headline. */
  proto?: boolean;
  /** Desktop — render the iPhone hero background (reef shader + agent orb dial). */
  iphoneBackdrop?: boolean;
}) {
  const [introZoom, setIntroZoom] = useState(DOEPHONE_HERO_INTRO_GRADIENT_START);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || proto) {
      setIntroZoom(1);
      setIntroDone(true);
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DOEPHONE_HERO_INTRO_GRADIENT_MS);
      const eased = t * t * (3 - 2 * t);
      setIntroZoom(
        DOEPHONE_HERO_INTRO_GRADIENT_START +
          (1 - DOEPHONE_HERO_INTRO_GRADIENT_START) * eased,
      );
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIntroZoom(1);
        setIntroDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [proto]);

  const gradientZoom = introDone ? 1 : introZoom;
  const isDesktop = variant === "desktop";
  const isMobile = !isDesktop;
  const isProto = proto;
  /** iPhone-style hero (reef shader + orb dial) — mobile always, desktop when opted in. */
  const renderIphoneHero = !isProto && (isMobile || iphoneBackdrop);
  const homeHeroShader = doeHomeHeroReefShaderSurface();
  const heroHeight = isDesktop
    ? DOEPHONE_HERO_DESKTOP_HEIGHT
    : isProto
      ? PROTO_HERO_HEIGHT
      : DOEPHONE_HERO_HEIGHT;
  const copyInset = isDesktop ? DOEPHONE_DESKTOP_PAGE_INSET_LEFT : DOEPHONE_HERO_COPY_INSET;
  const copyBottom = isDesktop
    ? "bottom-[clamp(5rem,16vh,10rem)]"
    : "bottom-[clamp(2.75rem,9vmin,4.25rem)]";

  return (
    <section
      className={`doephone-hero-section relative w-full overflow-hidden ${
        isProto ? "" : "bg-[#042A32]"
      }`}
      style={
        {
          minHeight: heroHeight,
          height: heroHeight,
          ...(renderIphoneHero
            ? { backgroundColor: DOE_HOME_HERO_REEF_PALETTE.back }
            : isMobile && isProto
              ? { backgroundColor: PROTO_RECEPTION_PALETTE.deep }
              : {}),
          ...doephoneHeroIntroStyleVars(),
        } as CSSProperties
      }
      aria-label="Hero"
    >
      {isProto && isMobile ? (
        <ProtoHomeHeroGradient />
      ) : renderIphoneHero ? (
        <ProtoGrainGradient
          variant={homeHeroShader.variant}
          colors={homeHeroShader.colors}
          colorBack={homeHeroShader.colorBack}
        />
      ) : (
        <WorkflowCarouselDesignBackdrop
          backdrop={CARE_COORDINATION_BACKDROP}
          embedded
          introOnLoad={!isProto}
          gradientScale={gradientZoom}
        />
      )}

      {renderIphoneHero ? <DoePhoneHeroGradientCircles variant={variant} /> : null}

      <div
        className={`absolute left-0 right-0 z-[3] ${copyInset} ${copyBottom}`}
      >
        <div className="doephone-hero-copy pointer-events-none w-full min-w-0">
          <DoePhoneHeroHeadline
            line1={isProto ? "Recruiting for the" : undefined}
            line2={isProto ? "intelligence era." : undefined}
            fontClass={isProto ? PROTO_FONT_CLASS : undefined}
          />
        </div>
      </div>
    </section>
  );
}
