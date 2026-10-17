"use client";

import { useRef } from "react";

import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2Hero } from "@/components/doehealth-desk2/DoeHealthDesk2Hero";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2Workspace } from "@/components/doehealth-desk2/DoeHealthDesk2Workspace";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its logo and section anchors live here. */
const DESK2_PATH = "/doehealthdesk2";

/**
 * /earlypreview: the /product-nav beige page. The nav keeps only the mark and the CTA (no page links), and the first
 * section is the /doehealthdesk2 hero with its video card, restyled to the beige. The teach box and footer follow
 * /product-nav.
 */
export function EarlyPreviewPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  const rootRef = useRef<HTMLDivElement>(null);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  useDoePhoneStableViewport(variant === "phone");
  useDoeHealthDesk2PhoneScreenHeight(variant === "phone");
  useDoeHealthDesk2FitTitles(rootRef);

  return (
    <div
      ref={rootRef}
      className={`doehealth-desk2-page doehealth-earlypreview-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
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
        />
      )}
      <DoeHealthDesk2NavWash />
      <main
        className="doehealth-desk2-main doehealth-desk2-nav-wash-surface min-h-[100dvh]"
        data-nav-beige="1"
        aria-label="Early preview"
      >
        <div className="doehealth-desk2-hero-stack">
          <DoeHealthDesk2Hero />
          <DoeHealthDesk2Workspace />
        </div>
        <DoeHealthDesk2InviteSection />
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
