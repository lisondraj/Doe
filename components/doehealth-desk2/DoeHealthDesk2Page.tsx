"use client";

import { useRef } from "react";

import { DoeHealthDesk2AudienceSection } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import {
  DoeHealthDesk2AgentsSection,
  DoeHealthDesk2BlankSection,
  DoeHealthDesk2InviteSection,
} from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2Hero } from "@/components/doehealth-desk2/DoeHealthDesk2Hero";
import { DoeHealthDesk2Workspace } from "@/components/doehealth-desk2/DoeHealthDesk2Workspace";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";
import { EARLYPREVIEW_MAIN_VIDEO } from "@/lib/earlypreview/earlypreview-videos";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { p22Mackinac } from "@/lib/home/fonts";

type DoeHealthDesk2PageProps = {
  initialVariant: DoeHealthDesk2Variant;
};

/** /doehealthdesk — legacy /oldphone nav only on a blank canvas. */
export function DoeHealthDesk2Page({ initialVariant }: DoeHealthDesk2PageProps) {
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
      className={`doehealth-desk2-page relative min-h-[100dvh] ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <>
          <DoeHealthDesk2DesktopNavBar />
          <DoeHealthDesk2NavWash />
        </>
      ) : (
        <>
          <DoeHealthDesk2PhoneNavBar />
          <DoeHealthDesk2NavWash />
        </>
      )}
      <main className="doehealth-desk2-main min-h-[100dvh]" aria-label="Desk canvas">
        <div className="doehealth-desk2-hero-stack">
          <DoeHealthDesk2Hero />
          <DoeHealthDesk2Workspace film={heroFilm} filmLabel={EARLYPREVIEW_MAIN_VIDEO.title.join(" ")} />
        </div>
        <DoeHealthDesk2AudienceSection />
        <DoeHealthDesk2AgentsSection />
        <DoeHealthDesk2BlankSection tone="brown" />
        <DoeHealthDesk2BlankSection tone="white" />
        <DoeHealthDesk2BlankSection tone="brown" />
        <DoeHealthDesk2BlankSection tone="white" />
        <DoeHealthDesk2BlankSection tone="brown" />
        <DoeHealthDesk2InviteSection />
        <DoeHealthDesk2Footer tone="salmon" />
      </main>
    </div>
  );
}
