"use client";

import { DoeHealthBlogArticle } from "@/components/doehealth-blog/DoeHealthBlogArticle";
import { DoeHealthBlogCarousel } from "@/components/doehealth-blog/DoeHealthBlogCarousel";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDeskNavWash } from "@/components/doehealth-desk/DoeHealthDeskNavWash";
import { DoeHealthDeskInviteSection } from "@/components/doehealth-desk/DoeHealthDeskStorySections";
import { LegacyHomeDesktopNavBar } from "@/components/home/LegacyHomeDesktopNavBar";
import { LegacyHomePhoneNavBar } from "@/components/home/LegacyHomePhoneNavBar";
import type { DoeHealthBlogArticle as Article } from "@/lib/doehealth/doehealth-blog-articles";
import { DOEHEALTH_DESK_PAGE_BACKGROUND } from "@/lib/doehealth/doehealth-desk-colors";
import { useDoeHealthDeskPhoneOverflowChrome } from "@/lib/doehealth/use-doehealth-desk-phone-overflow-chrome";
import {
  type DoeHealthDeskVariant,
  useDoeHealthDeskVariant,
} from "@/lib/doehealth/use-doehealth-desk-variant";
import { p22Mackinac } from "@/lib/home/fonts";

const DESK_PATH = "/doehealthdesk";
/** The "Doe" logo in the nav goes to the desk2 landing page. */
const LOGO_HREF = "/doehealthdesk2";

type DoeHealthBlogPageProps = {
  article: Article;
  initialVariant: DoeHealthDeskVariant;
};

/** /doehealthblog — desk nav and footer around a long-form article and the related-post carousel. */
export function DoeHealthBlogPage({ article, initialVariant }: DoeHealthBlogPageProps) {
  const variant = useDoeHealthDeskVariant(initialVariant);
  useDoeHealthDeskPhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk-page doehealth-blog-page relative min-h-[100dvh] ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <LegacyHomeDesktopNavBar homeHref={LOGO_HREF} sectionHrefBase={DESK_PATH} />
      ) : (
        <LegacyHomePhoneNavBar homeHref={LOGO_HREF} sectionHrefBase={DESK_PATH} />
      )}
      <DoeHealthDeskNavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="Blog">
        <DoeHealthBlogArticle article={article} />
        <DoeHealthBlogCarousel currentSlug={article.slug} />
        <DoeHealthDeskInviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
