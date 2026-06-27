"use client";

import { AboutHeroBands } from "@/components/about/AboutHeroBands";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { JoinApplyFormSection } from "@/components/join/JoinApplyFormSection";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { JOIN_MOBILE_HERO_SECTION, JOIN_MOBILE_NAV_CLEARANCE, JOIN_MOBILE_SECTION_STACK_GAP } from "@/lib/join/join-layout";

export function AboutMobileView() {
  useDoePhoneStableViewport();

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="subpage-investors"
      logoLink={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <main className={`flex w-full flex-col ${JOIN_MOBILE_SECTION_STACK_GAP} ${JOIN_MOBILE_NAV_CLEARANCE}`}>
        <section className={JOIN_MOBILE_HERO_SECTION} aria-label="About hero">
          <AboutHeroBands variant="mobile" />
        </section>
        <JoinInternTracks variant="mobile" />
      </main>

      <JoinApplyFormSection variant="mobile" />
    </BlogMobileShell>
  );
}
