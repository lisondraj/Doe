"use client";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JoinInternTracks } from "@/components/join/JoinInternTracks";
import { JoinViewportSpacer } from "@/components/join/JoinViewportSpacer";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";

export function JoinMobileView() {
  return (
    <BlogMobileShell showJoinCta={false} logoLink={false} footerLinksDisabled showMenu={false}>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <JoinInternshipHero variant="mobile" />
        <JoinInternTracks variant="mobile" />
      </main>

      <JoinViewportSpacer variant="mobile" />
    </BlogMobileShell>
  );
}
