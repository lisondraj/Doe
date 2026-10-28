"use client";

import { useRef } from "react";

import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { EarlyPreviewTiersSection } from "@/components/earlypreview/EarlyPreviewMarketSection";
import { EarlyPreviewHeroStack } from "@/components/earlypreview/EarlyPreviewPage";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { SERVICES_TIERS } from "@/lib/services/services-tiers-copy";

/** The desk2 site: its logo and section anchors live here. */
const DESK2_PATH = "/doehealthdesk2";

/**
 * /services: Doe for the service economy, built quietly beside /earlypreview. The same nav and hero, then one section,
 * the tiers table with the features a service business would want.
 */
export function ServicesPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  const heroFilm = useEarlyPreviewFilm("hero");
  const rootRef = useRef<HTMLDivElement>(null);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  useDoePhoneStableViewport(variant === "phone");
  useDoeHealthDesk2PhoneScreenHeight(variant === "phone");
  useDoeHealthDesk2FitTitles(rootRef);

  return (
    <div
      ref={rootRef}
      className={`doehealth-desk2-page earlypreview-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          centerLinks={false}
          primaryCta={EARLYPREVIEW_NAV_CTA}
        />
      ) : (
        <DoeHealthDesk2PhoneNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          primaryCta={EARLYPREVIEW_NAV_CTA}
          menuMailTo="james@doe.care"
        />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk2-main min-h-[100dvh]" aria-label="Doe for services">
        <EarlyPreviewHeroStack heroFilm={heroFilm} />
        <EarlyPreviewTiersSection table={SERVICES_TIERS} label="What's in each tier, for service businesses" />
      </main>
    </div>
  );
}
