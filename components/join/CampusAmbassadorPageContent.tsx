import Link from "next/link";

import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { CampusAmbassadorApplyPanel } from "@/components/join/CampusAmbassadorApplyPanel";
import { CampusAmbassadorBenefitsPanel } from "@/components/join/CampusAmbassadorBenefitsPanel";
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
  BROADER_DOE_VISION_TITLE_TW,
  ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { BROADER_DOE_VISION_HERO_BACKDROP } from "@/lib/blog/broader-doe-vision-article";
import { inter } from "@/lib/home/fonts";
import {
  CAMPUS_AMBASSADOR_FOUNDERS_HEADING,
  CAMPUS_AMBASSADOR_FOUNDERS_MEMO_LINK_LABEL,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_AFTER,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_BEFORE,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_GOLD,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY,
  CAMPUS_AMBASSADOR_PAGE_TITLE,
} from "@/lib/join/campus-ambassador-copy";
import { PREMED_PATH } from "@/lib/site-domains";

function CampusAmbassadorFoundersMemoLinkArrow() {
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

/** doe.care /join — campus ambassador article band (phone + desktop). */
export function CampusAmbassadorPageContent() {
  return (
    <div className="about-page-content campus-ambassador-page-content min-w-0 max-w-full">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <Link
            href={PREMED_PATH}
            data-premed-allow-link
            className={`campus-ambassador-founders-memo-link ${inter.className}`}
          >
            <CampusAmbassadorFoundersMemoLinkArrow />
            <span className="campus-ambassador-founders-memo-link__label">
              {CAMPUS_AMBASSADOR_FOUNDERS_MEMO_LINK_LABEL}
            </span>
          </Link>
          <h1 className={`${BROADER_DOE_VISION_TITLE_TW} ${ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW}`}>
            {CAMPUS_AMBASSADOR_PAGE_TITLE}
          </h1>
        </div>
      </header>

      <div className={BROADER_DOE_VISION_HERO_WRAP}>
        <BlogHeroVisual
          backdrop={BROADER_DOE_VISION_HERO_BACKDROP}
          variant="hero"
          boxClassName={ABOUT_PAGE_HERO_BOX_TW}
          gapClassName=""
          useJoinCampusHeroDuskShader
        />
      </div>

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            {CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_BEFORE}
            <span className="broader-doe-thesis-text">{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_GOLD}</span>
            {CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_AFTER}
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            <span className="broader-doe-thesis-text">{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY}</span>
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH}</p>

          <CampusAmbassadorBenefitsPanel />

          <CampusAmbassadorApplyPanel />

          <PremedEmailInvite />

          <PremedFoundersBlock
            heading={CAMPUS_AMBASSADOR_FOUNDERS_HEADING}
            headingClassName="campus-ambassador-founders-heading"
            showDividers={false}
            showTopDivider
          />

          <BlogArticleFooterCarouselBand>
            <PremedBlogRelatedCarousel currentSlug="the-broader-doe-vision" />
          </BlogArticleFooterCarouselBand>
        </div>
      </div>
    </div>
  );
}
