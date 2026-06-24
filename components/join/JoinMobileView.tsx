"use client";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { JoinApplyFormSection } from "@/components/join/JoinApplyFormSection";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { JOIN_MOBILE_HERO_VIEWPORT_SECTION } from "@/lib/join/join-layout";

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
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <section className={JOIN_MOBILE_HERO_VIEWPORT_SECTION} aria-label="Internship hero">
          <JoinInternshipHero variant="mobile" fillViewport />
        </section>
        <JoinInternTracks variant="mobile" />
      </main>

      <JoinApplyFormSection variant="mobile" />
    </BlogMobileShell>
  );
}
