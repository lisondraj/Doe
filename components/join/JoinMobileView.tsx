"use client";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { JoinApplyFormSection } from "@/components/join/JoinApplyFormSection";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { JOIN_MOBILE_HERO_SECTION, JOIN_MOBILE_HERO_TO_TRACK_SPACER, JOIN_MOBILE_NAV_CLEARANCE } from "@/lib/join/join-layout";

export function JoinMobileView() {
  useDoePhoneStableViewport();

  return (
    <BlogMobileShell
      showJoinCta={false}
      logoLink={false}
      footerLinksDisabled
      showMenu={false}
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <main className={`w-full ${JOIN_MOBILE_NAV_CLEARANCE}`}>
        <section className={JOIN_MOBILE_HERO_SECTION} aria-label="Internship hero">
          <JoinInternshipHero variant="mobile" />
        </section>
        <div aria-hidden className={JOIN_MOBILE_HERO_TO_TRACK_SPACER} />
        <JoinInternTracks variant="mobile" />
      </main>

      <JoinApplyFormSection variant="mobile" />
    </BlogMobileShell>
  );
}
