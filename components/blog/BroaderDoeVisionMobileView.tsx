"use client";

import { BroaderDoeVisionPageContent } from "@/components/blog/BroaderDoeVisionPageContent";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { ABOUT_STYLE_PHONE_SHELL_PROPS, ABOUT_STYLE_TOP_BANNER } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { useAboutStylePhonePageChrome } from "@/lib/about/use-about-style-phone-page-chrome";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import "@/lib/doehealth/doehealth-landing.css";

/** iPhone /about — Broader Doe Vision article layout. */
export function BroaderDoeVisionMobileView() {
  useAboutStylePhonePageChrome();

  return (
    <BlogMobileShell
      {...ABOUT_STYLE_PHONE_SHELL_PROPS}
      topBanner={<DoeHealthTopBanner {...ABOUT_STYLE_TOP_BANNER} />}
    >
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <BroaderDoeVisionPageContent />
      </main>
    </BlogMobileShell>
  );
}
