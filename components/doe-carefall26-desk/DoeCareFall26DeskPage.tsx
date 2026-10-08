"use client";

import { useEffect, useState } from "react";

import { DoeCareFall26DeskDesktopNavBar } from "@/components/doe-carefall26-desk/DoeCareFall26DeskDesktopNavBar";
import { DoeCareFall26DeskFooter } from "@/components/doe-carefall26-desk/DoeCareFall26DeskFooter";
import { DoeCareFall26DeskHero } from "@/components/doe-carefall26-desk/DoeCareFall26DeskHero";
import { DoeCareFall26DeskNavWash } from "@/components/doe-carefall26-desk/DoeCareFall26DeskNavWash";
import { DoeCareFall26DeskPhoneNavBar } from "@/components/doe-carefall26-desk/DoeCareFall26DeskPhoneNavBar";
import { DoeCareFall26DeskWorkspace } from "@/components/doe-carefall26-desk/DoeCareFall26DeskWorkspace";
import { PremedLearnMoreProvider } from "@/components/premed/PremedLearnMoreProvider";
import { DOECAREFALL26_DESK_PAGE_BACKGROUND } from "@/lib/doecarefall26/doecarefall26-desk-colors";
import { useDoeCareFall26DeskPhoneOverflowChrome } from "@/lib/doecarefall26/use-doecarefall26-desk-phone-overflow-chrome";
import { p22Mackinac } from "@/lib/home/fonts";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

type DoeCareFall26DeskPageProps = {
  initialVariant: Variant;
};

/** /doecarefall26 — announce strip, nav, and landing only. */
export function DoeCareFall26DeskPage({ initialVariant }: DoeCareFall26DeskPageProps) {
  const [variant, setVariant] = useState<Variant>(initialVariant);
  useDoeCareFall26DeskPhoneOverflowChrome(variant === "phone");

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
    <PremedLearnMoreProvider>
      <div
        className={`doecarefall26-desk-page relative min-h-[100dvh] ${p22Mackinac.variable}`}
        style={{ backgroundColor: DOECAREFALL26_DESK_PAGE_BACKGROUND }}
        data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
      >
        {variant === "desktop" ? (
          <>
            <DoeCareFall26DeskDesktopNavBar />
            <DoeCareFall26DeskNavWash />
          </>
        ) : (
          <>
            <DoeCareFall26DeskPhoneNavBar />
            <DoeCareFall26DeskNavWash />
          </>
        )}
        <main className="doecarefall26-desk-main" aria-label="Landing">
          <div className="doecarefall26-desk-hero-stack">
            <DoeCareFall26DeskHero />
            <DoeCareFall26DeskWorkspace />
          </div>
          <DoeCareFall26DeskFooter />
        </main>
      </div>
    </PremedLearnMoreProvider>
  );
}
