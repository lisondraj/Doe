import Link from "next/link";

import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BLOG_JOIN_CAMPUS_HERO_BACKDROP } from "@/lib/blog/blog-about-shader-backdrops";
import { ClinicalPartnersApplyPanel } from "@/components/partners/ClinicalPartnersApplyPanel";
import { PremedBlogRelatedCarousel } from "@/components/premed/PremedBlogRelatedCarousel";
import { PremedEmailInvite } from "@/components/premed/PremedEmailInvite";
import { PremedFoundersBlock } from "@/components/premed/PremedFoundersBlock";
import {
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_SECTION_GAP,
  ABOUT_PAGE_HERO_BOX_TW,
} from "@/lib/about/about-layout-styles";
import {
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_HERO_HEADLINES_WRAP,
  BROADER_DOE_VISION_HERO_INTRO_WRAP,
  BROADER_DOE_VISION_HERO_WRAP,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_TITLE_TW,
  ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { BROADER_DOE_VISION_HERO_BACKDROP } from "@/lib/blog/broader-doe-vision-article";
import { inter } from "@/lib/home/fonts";
import {
  CLINICAL_PARTNERS_FOUNDERS_HEADING,
  CLINICAL_PARTNERS_FOUNDERS_MEMO_LINK_LABEL,
  CLINICAL_PARTNERS_OPENING_PARAGRAPH_AFTER,
  CLINICAL_PARTNERS_OPENING_PARAGRAPH_BEFORE,
  CLINICAL_PARTNERS_OPENING_PARAGRAPH_BENEFITS,
  CLINICAL_PARTNERS_OPENING_PARAGRAPH_GOLD,
  CLINICAL_PARTNERS_OPENING_PARAGRAPH_LAUNCH,
  CLINICAL_PARTNERS_PAGE_SUBTITLE,
  CLINICAL_PARTNERS_PAGE_TITLE,
} from "@/lib/partners/clinical-partners-copy";
import { PREMED_PATH } from "@/lib/site-domains";

function ClinicalPartnersFoundersMemoLinkArrow() {
  return (
    <svg
      className="campus-ambassador-founders-memo-link__arrow"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M9.5 6h-7M5.25 8.75 2.5 6l2.75-2.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** doe.care /partners — clinical partners article band (phone + desktop). */
export function ClinicalPartnersPageContent() {
  return (
    <div className="about-page-content campus-ambassador-page-content min-w-0 max-w-full">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <Link
            href={PREMED_PATH}
            data-premed-allow-link
            className={`campus-ambassador-founders-memo-link ${inter.className}`}
          >
            <ClinicalPartnersFoundersMemoLinkArrow />
            <span className="campus-ambassador-founders-memo-link__label">
              {CLINICAL_PARTNERS_FOUNDERS_MEMO_LINK_LABEL}
            </span>
          </Link>
          <h1 className={`${BROADER_DOE_VISION_TITLE_TW} ${ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW}`}>
            {CLINICAL_PARTNERS_PAGE_TITLE}
          </h1>
          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>
            {CLINICAL_PARTNERS_PAGE_SUBTITLE}
          </p>
        </div>
      </header>

      <div className={BROADER_DOE_VISION_HERO_WRAP}>
        <BlogHeroVisual
          backdrop={BROADER_DOE_VISION_HERO_BACKDROP}
          backdropImageSrc={BLOG_JOIN_CAMPUS_HERO_BACKDROP}
          variant="hero"
          boxClassName={ABOUT_PAGE_HERO_BOX_TW}
          gapClassName=""
          useJoinCampusHeroDuskShader
        />
      </div>

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            {CLINICAL_PARTNERS_OPENING_PARAGRAPH_BEFORE}
            <span className="broader-doe-thesis-text">{CLINICAL_PARTNERS_OPENING_PARAGRAPH_GOLD}</span>
            {CLINICAL_PARTNERS_OPENING_PARAGRAPH_AFTER}
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            <span className="broader-doe-thesis-text">{CLINICAL_PARTNERS_OPENING_PARAGRAPH_BENEFITS}</span>
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>{CLINICAL_PARTNERS_OPENING_PARAGRAPH_LAUNCH}</p>

          <ClinicalPartnersApplyPanel />

          <PremedEmailInvite />

          <PremedFoundersBlock
            heading={CLINICAL_PARTNERS_FOUNDERS_HEADING}
            headingClassName="campus-ambassador-founders-heading"
            showDividers={false}
            showTopDivider
          />

          <BlogArticleFooterCarouselBand>
            <PremedBlogRelatedCarousel currentSlug="the-broader-doe-vision" useBakedShaderBackdrops />
          </BlogArticleFooterCarouselBand>
        </div>
      </div>
    </div>
  );
}
