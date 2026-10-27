"use client";

import { DoeHealthBlogArticle } from "@/components/doehealth-blog/DoeHealthBlogArticle";
import { DoeHealthBlogCarousel } from "@/components/doehealth-blog/DoeHealthBlogCarousel";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import type { DoeHealthBlogArticle as Article } from "@/lib/doehealth/doehealth-blog-articles";
import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its nav links, logo, and section anchors all live here. */
const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";

type DoeHealthBlogPageProps = {
  article: Article;
  initialVariant: DoeHealthDesk2Variant;
  /**
   * The `/preview-<slug>` duplicate: /earlypreview's nav (the mark and "Contact James", no page links), and the
   * "More from Doe" cards open the same Contact James mail as that button.
   */
  preview?: boolean;
};

/** /news/[slug] — desk2 nav and footer around a long-form article and the related-post carousel. */
export function DoeHealthBlogPage({ article, initialVariant, preview = false }: DoeHealthBlogPageProps) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page${preview ? " doehealth-blog-page--preview" : ""} relative min-h-[100dvh] ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        preview ? (
          <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} centerLinks={false} primaryCta={EARLYPREVIEW_NAV_CTA} />
        ) : (
          <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
        )
      ) : preview ? (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} primaryCta={EARLYPREVIEW_NAV_CTA} menuMailTo={ABOUT_CONTACT_EMAIL} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="Blog">
        <DoeHealthBlogArticle article={article} />
        <DoeHealthBlogCarousel currentSlug={article.slug} cardHref={preview ? EARLYPREVIEW_NAV_CTA.href : undefined} />
        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
