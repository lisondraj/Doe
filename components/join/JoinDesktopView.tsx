"use client";

import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import { DesktopSiteFooter } from "@/components/home/DesktopSiteFooter";
import { JoinDesktopNav } from "@/components/join/JoinDesktopNav";
import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { JoinApplyFormSection } from "@/components/join/JoinApplyFormSection";
import { JOIN_DESKTOP_CONTENT, JOIN_DESKTOP_HERO_TOP_PAD, JOIN_DESKTOP_TRACK_ROW_GAP } from "@/lib/join/join-layout";

export function JoinDesktopView() {
  return (
    <DesktopRouteLayout>
      <div
        className="relative min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
        data-doeforvc-view="desktop"
      >
        <JoinDesktopNav />

        <main className="pt-[5.5rem]">
          <div className={`${JOIN_DESKTOP_CONTENT} ${JOIN_DESKTOP_HERO_TOP_PAD}`}>
            <JoinInternshipHero variant="desktop" />
          </div>
          <div className={`${JOIN_DESKTOP_CONTENT} ${JOIN_DESKTOP_TRACK_ROW_GAP}`}>
            <JoinInternTracks variant="desktop" />
          </div>
          <JoinApplyFormSection variant="desktop" />
        </main>

        <DesktopSiteFooter linksDisabled />
      </div>
    </DesktopRouteLayout>
  );
}
