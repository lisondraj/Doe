"use client";

import { JoinMobileHero } from "@/components/join/JoinMobileHero";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";

export function JoinMobileView() {
  return (
    <BlogMobileShell showJoinCta={false} logoLink={false} footerLinksDisabled showMenu={false}>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <JoinMobileHero />
      </main>
    </BlogMobileShell>
  );
}
