import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogArticleRelatedCarousel } from "@/components/blog/BlogArticleRelatedCarousel";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { CampusAmbassadorApplyPanel } from "@/components/join/CampusAmbassadorApplyPanel";
import { PremedEmailInvite } from "@/components/premed/PremedEmailInvite";
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
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { BROADER_DOE_VISION_HERO_BACKDROP } from "@/lib/blog/broader-doe-vision-article";
import {
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH,
  CAMPUS_AMBASSADOR_PAGE_TITLE,
  CAMPUS_AMBASSADOR_REQUIRED_NOTE,
  CAMPUS_AMBASSADOR_SUBHEADING,
} from "@/lib/join/campus-ambassador-copy";
import { dmSans } from "@/lib/home/fonts";

/** doe.care /join — campus ambassador iPhone article band. */
export function CampusAmbassadorPageContent() {
  return (
    <div className="about-page-content">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <h1 className={BROADER_DOE_VISION_TITLE_TW}>{CAMPUS_AMBASSADOR_PAGE_TITLE}</h1>

          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>
            {CAMPUS_AMBASSADOR_SUBHEADING}
          </p>

          <p
            className={`campus-ambassador-required-note mx-auto mt-4 max-w-[34ch] text-[clamp(0.98rem,0.86rem+0.45vmin,1.12rem)] font-medium leading-snug tracking-[-0.01em] iphone-page:mt-5 iphone-page:text-[clamp(1.02rem,0.9rem+0.48vmin,1.16rem)] ${dmSans.className}`}
          >
            {CAMPUS_AMBASSADOR_REQUIRED_NOTE}
          </p>
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
          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{CAMPUS_AMBASSADOR_OPENING_PARAGRAPH}</p>

          <CampusAmbassadorApplyPanel />

          <PremedEmailInvite />

          <BlogArticleFooterCarouselBand>
            <BlogArticleRelatedCarousel currentSlug="the-broader-doe-vision" />
          </BlogArticleFooterCarouselBand>
        </div>
      </div>
    </div>
  );
}
