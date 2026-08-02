import { AboutStyleContactLink } from "@/components/blog/AboutStyleContactLink";
import { BroaderDoeVisionEmailInvite } from "@/components/blog/BroaderDoeVisionEmailInvite";
import { BroaderDoeVisionProposalQuote } from "@/components/blog/BroaderDoeVisionProposalQuote";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_LIST_GAP,
  ABOUT_MOBILE_SECTION_GAP,
  ABOUT_PAGE_HERO_BOX_TW,
} from "@/lib/about/about-layout-styles";
import {
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_BYLINE_TW,
  BROADER_DOE_VISION_HERO_HEADLINES_WRAP,
  BROADER_DOE_VISION_HERO_INTRO_WRAP,
  BROADER_DOE_VISION_HERO_WRAP,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_THESIS_ITEM_TW,
  BROADER_DOE_VISION_THESIS_LIST_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW,
  BROADER_DOE_VISION_TITLE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import {
  BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH,
  BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH_INDEX,
  BROADER_DOE_VISION_BODY_PARAGRAPHS,
  BROADER_DOE_VISION_BYLINE,
  BROADER_DOE_VISION_CLOSING,
  BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX,
  BROADER_DOE_VISION_DATE,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
  BROADER_DOE_VISION_HERO_BACKDROP,
  BROADER_DOE_VISION_PROPOSAL_CLOSING,
  BROADER_DOE_VISION_OPENING_LEDE,
  BROADER_DOE_VISION_SUBHEADING,
  BROADER_DOE_VISION_THESIS_INTRO,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE,
  BROADER_DOE_VISION_THESIS_POINTS,
  BROADER_DOE_VISION_TITLE,
} from "@/lib/blog/broader-doe-vision-article";
/** iPhone /about — Broader Doe Vision scroll structure. */
export function BroaderDoeVisionPageContent() {
  return (
    <div className="about-page-content">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <h1 className={BROADER_DOE_VISION_TITLE_TW}>{BROADER_DOE_VISION_TITLE}</h1>

          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>
            {BROADER_DOE_VISION_SUBHEADING}
          </p>

          <p className={BROADER_DOE_VISION_BYLINE_TW}>
            {BROADER_DOE_VISION_BYLINE}
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {BROADER_DOE_VISION_DATE}
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
          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{BROADER_DOE_VISION_OPENING_LEDE}</p>

          {BROADER_DOE_VISION_BODY_PARAGRAPHS.map((paragraph, index) => (
            <p key={paragraph} className={BROADER_DOE_VISION_BODY_TW}>
              {index === BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX ? (
                <>
                  <span className="broader-doe-thesis-text">{paragraph}</span>
                  <span className="inline-block pl-1 align-baseline">
                    <AboutStyleContactLink />
                  </span>
                </>
              ) : index === BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH_INDEX ? (
                <>
                  {BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH.before}
                  <span className="font-semibold">{BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH.bold}</span>
                  {BROADER_DOE_VISION_AI_PLAYBOOK_PARAGRAPH.after}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}

          <BroaderDoeVisionProposalQuote />

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_PROPOSAL_CLOSING}</p>

          <figure className="m-0">
            <figcaption className={BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW}>
              {BROADER_DOE_VISION_THESIS_SECTION_HEADLINE}
            </figcaption>
            <p className={`${BROADER_DOE_VISION_BODY_TW} !mt-0`}>{BROADER_DOE_VISION_THESIS_INTRO}</p>
          </figure>

          <ol className={`${BROADER_DOE_VISION_THESIS_LIST_TW} ${ABOUT_MOBILE_LIST_GAP}`}>
            {BROADER_DOE_VISION_THESIS_POINTS.map((point, index) => (
              <li
                key={point}
                className={`${BROADER_DOE_VISION_THESIS_ITEM_TW} grid grid-cols-[1.35em_minmax(0,1fr)] gap-x-0`}
              >
                <span className="broader-doe-thesis-text">{index + 1}.</span>
                <span className="broader-doe-thesis-text">{point}</span>
              </li>
            ))}
          </ol>

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_CLOSING}</p>

          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{BROADER_DOE_VISION_FINAL_PARAGRAPH}</p>

          <BroaderDoeVisionEmailInvite />
        </div>
      </div>
    </div>
  );
}
