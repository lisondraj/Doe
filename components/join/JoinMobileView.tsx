"use client";

import { BlogLandingHero } from "@/components/blog/BlogLandingHero";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";

export function JoinMobileView() {
  return (
    <BlogMobileShell showJoinCta={false} logoLink={false} footerLinksDisabled showMenu={false}>
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <BlogLandingHero line1="Join the" line2="waitlist." />
      </main>
    </BlogMobileShell>
  );
}
