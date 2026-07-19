"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";

import { DoePhoneHomeHeroGrainShader } from "@/components/doephone/DoePhoneHomeHeroGrainShader";
import { DesignersGuidancePanel } from "@/components/designers/DesignersGuidancePanel";
import { DesignersProductSection } from "@/components/designers/DesignersProductSection";
import { DesignersTypographySection } from "@/components/designers/DesignersTypographySection";
import { DesignersWelcomeModal } from "@/components/designers/DesignersWelcomeModal";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";
import { DESIGNERS_HERO_GRADIENT_FLOWS } from "@/lib/designers/designers-hero-gradient-flows";
import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";
import { suisseIntl } from "@/lib/home/fonts";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { preloadShaderNoiseTexture } from "@/lib/doephone/shader-noise-texture";
import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import {
  doeHealthPageUrl,
  isDesignersHost,
  isLocalDevHost,
} from "@/lib/site-domains";

function useDoeHealthReturnHref(): string {
  const [href, setHref] = useState("/doehealth");

  useLayoutEffect(() => {
    const host = window.location.hostname;
    if (isDesignersHost(host)) {
      setHref("/");
      return;
    }
    if (isLocalDevHost(host)) {
      setHref("/doehealth");
      return;
    }
    setHref(doeHealthPageUrl());
  }, []);

  return href;
}

function applyPhoneDocumentAttrs() {
  const html = document.documentElement;
  html.setAttribute("data-doeforvc-always-phone", "true");
  html.removeAttribute("data-layout");
  html.setAttribute("data-designers-page", "true");
}

function applyDesktopDocumentAttrs() {
  const html = document.documentElement;
  html.removeAttribute("data-doeforvc-always-phone");
  html.setAttribute("data-layout", "desktop");
  html.setAttribute("data-designers-page", "true");
}

function DesignersDesktopUiControls({
  hidden,
  onToggleHidden,
}: {
  hidden: boolean;
  onToggleHidden: () => void;
}) {
  if (hidden) {
    return null;
  }

  return (
    <div className="designers-desktop-ui-controls pointer-events-none fixed bottom-[clamp(1rem,1.75vw,1.5rem)] right-[clamp(1rem,1.75vw,1.5rem)] z-[200] flex flex-col items-end gap-[0.45rem]">
      <button
        type="button"
        onClick={onToggleHidden}
        className={`designers-desktop-ui-controls__button pointer-events-auto inline-flex min-h-[2.35rem] items-center justify-center rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white px-[0.95rem] text-[0.92rem] font-normal leading-none tracking-[-0.014em] text-[#1a1208] shadow-[0_8px_24px_rgba(26,18,8,0.12)] transition-[background-color,opacity] duration-150 hover:bg-[#f7f7f5] ${suisseIntl.className}`}
        aria-pressed={hidden}
      >
        Hide UI
      </button>
    </div>
  );
}

function DesignersDesktopHero() {
  const homeHeroShader = doeHomeHeroDuskShaderSurface();
  const [uiHidden, setUiHidden] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [gradientFlowIndex, setGradientFlowIndex] = useState(0);
  const gradientFlow = DESIGNERS_HERO_GRADIENT_FLOWS[gradientFlowIndex];
  const hasEntered = !welcomeOpen;

  useLayoutEffect(() => {
    applyDesktopDocumentAttrs();
    preloadShaderNoiseTexture();
  }, []);

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-designers-ui-hidden", uiHidden);
    return () => {
      document.documentElement.removeAttribute("data-designers-ui-hidden");
    };
  }, [uiHidden]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "d") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      event.preventDefault();
      setUiHidden(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className={`designers-desktop-root relative min-h-[100dvh] bg-[#1A1208]${uiHidden ? " designers-desktop-root--ui-hidden" : ""}`}
    >
      <section
        className="doephone-hero-section relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden"
        aria-label="Hero"
      >
        <DoePhoneHomeHeroGrainShader
          variant={homeHeroShader.variant}
          colors={homeHeroShader.colors}
          colorBack={homeHeroShader.colorBack}
          presetOverrides={gradientFlow.preset}
        />

        {hasEntered && !uiHidden ? (
          <DesignersGuidancePanel
            flows={DESIGNERS_HERO_GRADIENT_FLOWS}
            flowIndex={gradientFlowIndex}
            onSelectFlow={setGradientFlowIndex}
          />
        ) : null}
      </section>

      <DesignersTypographySection />

      <DesignersProductSection />

      {hasEntered && !uiHidden ? (
        <DesignersDesktopUiControls hidden={uiHidden} onToggleHidden={() => setUiHidden(true)} />
      ) : null}

      <DesignersWelcomeModal open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
    </div>
  );
}

function DesignersPhoneUnavailable() {
  const returnHref = useDoeHealthReturnHref();

  useLayoutEffect(() => {
    applyPhoneDocumentAttrs();
  }, []);

  return (
    <div className="designers-phone-unavailable relative flex min-h-[var(--doe-section-band-vh,var(--app-vh,100lvh))] flex-col items-center justify-center bg-[var(--doe-page-surface,#EDE8DF)] px-[var(--proto-phone-gutter-left,1.65rem)] py-[max(2rem,env(safe-area-inset-top))] text-center">
      <p
        className={`designers-phone-unavailable__message m-0 max-w-[18rem] text-[clamp(1.35rem,1rem+1.35vmin,1.72rem)] font-normal leading-[1.12] tracking-[-0.028em] text-[#3d2e1f] ${suisseIntl.className}`}
      >
        This page is only available on desktop.
      </p>
      <Link
        href={returnHref}
        className={`designers-phone-unavailable__cta mt-[clamp(1.35rem,0.9rem+1.5vmin,1.85rem)] inline-flex min-h-[3rem] items-center justify-center rounded-full border border-[rgba(26,18,8,0.12)] bg-[#1a1208] px-[clamp(1.35rem,1rem+1.1vmin,1.75rem)] text-[clamp(0.98rem,0.86rem+0.45vmin,1.08rem)] font-normal leading-none tracking-[-0.018em] text-[#faf0d8] transition-colors duration-150 hover:bg-[#241910] ${suisseIntl.className}`}
      >
        Return to doehealth.care
      </Link>
    </div>
  );
}

/** /designers — desktop hero gradient only; phone shows unavailable gate. */
export function DesignersPage() {
  const [variant, setVariant] = useState<DoePhoneVariant | null>(null);

  useLayoutEffect(() => {
    setVariant(readBootstrappedDoePhoneVariant());
  }, []);

  useEffect(() => {
    if (variant === null) return;

    const sync = () => setVariant(resolveDoePhoneVariant());
    sync();

    if (shouldLockDesignersTouchPhoneLayout()) {
      return;
    }

    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [variant]);

  if (variant === null) {
    return null;
  }

  return (
    <DesignersPhoneCanvas>
      {variant === "desktop" ? <DesignersDesktopHero /> : <DesignersPhoneUnavailable />}
    </DesignersPhoneCanvas>
  );
}
