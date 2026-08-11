import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { CampusAmbassadorApplyPanel } from "@/components/join/CampusAmbassadorApplyPanel";
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
import {
  CAMPUS_AMBASSADOR_FOUNDERS_HEADING,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH,
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY,
  CAMPUS_AMBASSADOR_PAGE_TITLE,
} from "@/lib/join/campus-ambassador-copy";

/** doe.care /join — campus ambassador iPhone article band. */
export function CampusAmbassadorPageContent() {
  return (
    <div className="about-page-content campus-ambassador-page-content min-w-0 max-w-full">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
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
          useAboutHeroDuskShader
        />
      </div>

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            <span className="broader-doe-thesis-text">{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH}</span>
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>
            <span className="broader-doe-thesis-text">{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_OPPORTUNITY}</span>
          </p>
          <p className={BROADER_DOE_VISION_BODY_TW}>{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH_LAUNCH}</p>

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
