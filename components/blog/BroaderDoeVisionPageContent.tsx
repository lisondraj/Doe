import { AboutStyleContactLink } from "@/components/blog/AboutStyleContactLink";
import { BroaderDoeVisionProposalQuote } from "@/components/blog/BroaderDoeVisionProposalQuote";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_LIST_GAP,
  ABOUT_MOBILE_SECTION_GAP,
  ABOUT_PAGE_HERO_AFTER_BYLINE,
  ABOUT_PAGE_HERO_BEFORE_ARTICLE,
  ABOUT_PAGE_HERO_BOX_TW,
  ABOUT_PAGE_HERO_HEADLINE_PT,
  ABOUT_PAGE_MOBILE_BYLINE_GAP,
  ABOUT_PAGE_MOBILE_BYLINE_TW,
  ABOUT_PAGE_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import {
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_THESIS_ITEM_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import {
  BROADER_DOE_VISION_BODY_PARAGRAPHS,
  BROADER_DOE_VISION_BYLINE,
  BROADER_DOE_VISION_CLOSING,
  BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX,
  BROADER_DOE_VISION_DATE,
  BROADER_DOE_VISION_HERO_BACKDROP,
  BROADER_DOE_VISION_PROPOSAL_CLOSING,
  BROADER_DOE_VISION_OPENING_LEDE,
  BROADER_DOE_VISION_SUBHEADING,
  BROADER_DOE_VISION_THESIS_INTRO,
  BROADER_DOE_VISION_THESIS_POINTS,
  BROADER_DOE_VISION_TITLE,
} from "@/lib/blog/broader-doe-vision-article";
/** iPhone /blog/the-broader-doe-vision — same scroll structure as /about. */
export function BroaderDoeVisionPageContent() {
  return (
    <div className="about-page-content">
      <div className={`${ABOUT_HERO_HEADLINE_WRAP} ${ABOUT_PAGE_HERO_HEADLINE_PT}`}>
        <h1 className={ABOUT_PAGE_TITLE_TW}>{BROADER_DOE_VISION_TITLE}</h1>

        <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} max-w-[36ch]`}>{BROADER_DOE_VISION_SUBHEADING}</p>
      </div>

      <p className={`${ABOUT_PAGE_MOBILE_BYLINE_TW} ${ABOUT_PAGE_MOBILE_BYLINE_GAP}`}>
        {BROADER_DOE_VISION_BYLINE}
        <span className="mx-2" aria-hidden>
          ·
        </span>
        {BROADER_DOE_VISION_DATE}
      </p>

      <div className={`${ABOUT_PAGE_HERO_AFTER_BYLINE} ${ABOUT_PAGE_HERO_BEFORE_ARTICLE}`}>
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
          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{BROADER_DOE_VISION_OPENING_LEDE}</p>

          {BROADER_DOE_VISION_BODY_PARAGRAPHS.map((paragraph, index) => (
            <p key={paragraph} className={BROADER_DOE_VISION_BODY_TW}>
              {paragraph}
              {index === BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX ? (
                <>
                  {" "}
                  <AboutStyleContactLink />
                </>
              ) : null}
            </p>
          ))}

          <BroaderDoeVisionProposalQuote />

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_PROPOSAL_CLOSING}</p>

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_THESIS_INTRO}</p>

          <ol className={`broader-doe-thesis-gradient ${ABOUT_MOBILE_LIST_GAP} list-none`}>
            {BROADER_DOE_VISION_THESIS_POINTS.map((point, index) => (
              <li key={point} className={`${BROADER_DOE_VISION_THESIS_ITEM_TW} pl-1`}>
                <span className="broader-doe-thesis-text">
                  {index + 1}. {point}
                </span>
              </li>
            ))}
          </ol>

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_CLOSING}</p>
        </div>
      </div>
    </div>
  );
}
