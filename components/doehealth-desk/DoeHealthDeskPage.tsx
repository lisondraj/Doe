"use client";

import { useEffect, useState } from "react";

import { DoeHealthDeskAudienceSection } from "@/components/doehealth-desk/DoeHealthDeskAudienceSection";
import { DoeHealthDeskFeatureSections } from "@/components/doehealth-desk/DoeHealthDeskFeatureSections";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDeskNavWash } from "@/components/doehealth-desk/DoeHealthDeskNavWash";
import { DoeHealthDeskGenomeSection } from "@/components/doehealth-desk/DoeHealthDeskGenomeSection";
import {
  DoeHealthDeskAgentsSection,
  DoeHealthDeskInviteSection,
} from "@/components/doehealth-desk/DoeHealthDeskStorySections";
import { DoeHealthDeskHero } from "@/components/doehealth-desk/DoeHealthDeskHero";
import { DoeHealthDeskWorkspace } from "@/components/doehealth-desk/DoeHealthDeskWorkspace";
import { LegacyHomeDesktopNavBar } from "@/components/home/LegacyHomeDesktopNavBar";
import { LegacyHomePhoneNavBar } from "@/components/home/LegacyHomePhoneNavBar";
import { DOEHEALTH_DESK_PAGE_BACKGROUND } from "@/lib/doehealth/doehealth-desk-colors";
import { p22Mackinac } from "@/lib/home/fonts";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

type DoeHealthDeskPageProps = {
  initialVariant: Variant;
};

/** /doehealthdesk — legacy /oldphone nav only on a blank canvas. */
export function DoeHealthDeskPage({ initialVariant }: DoeHealthDeskPageProps) {
  const [variant, setVariant] = useState<Variant>(initialVariant);

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
      className={`doehealth-desk-page relative min-h-[100dvh] ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <>
          <LegacyHomeDesktopNavBar />
          <DoeHealthDeskNavWash />
        </>
      ) : (
        <>
          <LegacyHomePhoneNavBar />
          <DoeHealthDeskNavWash />
        </>
      )}
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="Desk canvas">
        <div className="doehealth-desk-hero-stack">
          <DoeHealthDeskHero />
          <DoeHealthDeskWorkspace />
        </div>
        <DoeHealthDeskAudienceSection />
        <DoeHealthDeskGenomeSection />
        <DoeHealthDeskAgentsSection />
        <DoeHealthDeskFeatureSections />
        {(["problem", "solution"] as const).map((id) => (
          <section key={id} id={id} className="scroll-mt-28" aria-hidden />
        ))}
        <DoeHealthDeskInviteSection />
        <DoeHealthDeskFooter />
      </main>
    </div>
  );
}
