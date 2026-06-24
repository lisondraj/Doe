"use client";

import { JoinMobileHero } from "@/components/join/JoinMobileHero";
import { JoinMobileInternTracks } from "@/components/join/JoinMobileInternTracks";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";

export function JoinMobileView() {
  return (
    <BlogMobileShell showJoinCta={false} logoLink={false} footerLinksDisabled showMenu={false}>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <JoinMobileHero />
        <JoinMobileInternTracks />
      </main>

      <section
        className={`${DOEPHONE_VIEWPORT_SECTION} bg-[#F7F6F3]`}
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
        aria-hidden
      />
    </BlogMobileShell>
  );
}
