"use client";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { JoinHeroBands } from "@/components/join/JoinHeroBands";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { JoinApplyFormSection } from "@/components/join/JoinApplyFormSection";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { JOIN_MOBILE_HERO_SECTION, JOIN_MOBILE_NAV_CLEARANCE, JOIN_MOBILE_SECTION_STACK_GAP } from "@/lib/join/join-layout";

export function JoinMobileView() {
  useDoePhoneStableViewport();

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="subpage-join"
      logoLink={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <main className={`flex w-full flex-col ${JOIN_MOBILE_SECTION_STACK_GAP} ${JOIN_MOBILE_NAV_CLEARANCE}`}>
        <section className={JOIN_MOBILE_HERO_SECTION} aria-label="Internship hero">
          <JoinHeroBands variant="mobile" />
        </section>
        <JoinInternTracks variant="mobile" />
      </main>

      <JoinApplyFormSection variant="mobile" />
    </BlogMobileShell>
  );
}
