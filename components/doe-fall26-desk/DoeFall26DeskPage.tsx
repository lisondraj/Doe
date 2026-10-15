"use client";

import { useEffect, useState } from "react";

import { DoeFall26DeskAudienceSection } from "@/components/doe-fall26-desk/DoeFall26DeskAudienceSection";
import { DoeFall26DeskFeatureSections } from "@/components/doe-fall26-desk/DoeFall26DeskFeatureSections";
import { DoeFall26DeskFooter } from "@/components/doe-fall26-desk/DoeFall26DeskFooter";
import { DoeFall26DeskNavWash } from "@/components/doe-fall26-desk/DoeFall26DeskNavWash";
import { DoeFall26DeskGenomeSection } from "@/components/doe-fall26-desk/DoeFall26DeskGenomeSection";
import {
  DoeFall26DeskAgentsSection,
  DoeFall26DeskInviteSection,
} from "@/components/doe-fall26-desk/DoeFall26DeskStorySections";
import { DoeFall26DeskHero } from "@/components/doe-fall26-desk/DoeFall26DeskHero";
import { DoeFall26DeskWorkspace } from "@/components/doe-fall26-desk/DoeFall26DeskWorkspace";
import { DoeFall26DeskDesktopNavBar } from "@/components/doe-fall26-desk/DoeFall26DeskDesktopNavBar";
import { DoeFall26DeskPhoneNavBar } from "@/components/doe-fall26-desk/DoeFall26DeskPhoneNavBar";
import { DOE_FALL26_DESK_PAGE_BACKGROUND } from "@/lib/doefall26/doefall26-desk-colors";
import { useDoeFall26DeskPhoneOverflowChrome } from "@/lib/doefall26/use-doefall26-desk-phone-overflow-chrome";
import { p22Mackinac } from "@/lib/home/fonts";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

type DoeFall26DeskPageProps = {
  initialVariant: Variant;
};

/** /doefall26 — legacy /oldphone nav only on a blank canvas. */
export function DoeFall26DeskPage({ initialVariant }: DoeFall26DeskPageProps) {
  const [variant, setVariant] = useState<Variant>(initialVariant);
  useDoeFall26DeskPhoneOverflowChrome(variant === "phone");

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setVariant(mq.matches ? "desktop" : "phone");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (variant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.removeAttribute("data-doephone-pinching");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
      body.classList.remove("doephone-route");
    } else {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    }

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-doephone-pinching");
      body.classList.remove("desktop-route", "doephone-route");
    };
  }, [variant]);

  return (
    <div
      className={`doefall26-desk-page relative min-h-[100dvh] ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOE_FALL26_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <>
          <DoeFall26DeskDesktopNavBar />
          <DoeFall26DeskNavWash />
        </>
      ) : (
        <>
          <DoeFall26DeskPhoneNavBar />
          <DoeFall26DeskNavWash />
        </>
      )}
      <main className="doefall26-desk-main min-h-[100dvh]" aria-label="Desk canvas">
        <div className="doefall26-desk-hero-stack">
          <DoeFall26DeskHero />
          <DoeFall26DeskWorkspace />
        </div>
        <DoeFall26DeskAudienceSection />
        <DoeFall26DeskGenomeSection />
        <DoeFall26DeskAgentsSection />
        <DoeFall26DeskFeatureSections />
        {(["problem", "solution"] as const).map((id) => (
          <section key={id} id={id} className="scroll-mt-28" aria-hidden />
        ))}
        <DoeFall26DeskInviteSection />
        <DoeFall26DeskFooter />
      </main>
    </div>
  );
}
