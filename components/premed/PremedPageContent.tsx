import { AboutStyleArticleTableOfContents } from "@/components/blog/AboutStyleArticleTableOfContents";
import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogArticleCategory } from "@/components/blog/BlogArticleCategory";
import { BlogArticleRelatedCarousel } from "@/components/blog/BlogArticleRelatedCarousel";
import { BroaderDoeVisionProposalQuote } from "@/components/blog/BroaderDoeVisionProposalQuote";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { PremedContactLink } from "@/components/premed/PremedContactLink";
import { PremedEarlyStageLinks } from "@/components/premed/PremedEarlyStageLinks";
import { PremedEmailInvite } from "@/components/premed/PremedEmailInvite";
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
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW,
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
import { blogPostCategory } from "@/lib/blog/blog-post-categories";
import {
  ABOUT_STYLE_ARTICLE_SECTION_ANCHOR,
  ABOUT_STYLE_ARTICLE_TOC_IDS,
  tocIdFromLabel,
  type AboutStyleArticleTocItem,
} from "@/lib/blog/about-style-article-toc";

/** /premed — Broader Doe Vision scroll structure with disabled outbound navigation. */
export function PremedPageContent({
  tocItems,
}: {
  tocItems: readonly AboutStyleArticleTocItem[];
}) {
  const category = blogPostCategory("the-broader-doe-vision");

  return (
    <div className="about-page-content">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          {category ? <BlogArticleCategory category={category} /> : null}
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

      <AboutStyleArticleTableOfContents items={tocItems} />

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.intro} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
            <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{BROADER_DOE_VISION_OPENING_LEDE}</p>
          </div>

          {BROADER_DOE_VISION_BODY_PARAGRAPHS.map((paragraph, index) => (
            <p key={paragraph} className={BROADER_DOE_VISION_BODY_TW}>
              {index === BROADER_DOE_VISION_CONTACT_PARAGRAPH_INDEX ? (
                <>
                  <span className="broader-doe-thesis-text">{paragraph}</span>
                  <span className="inline-block pl-1 align-baseline">
                    <PremedContactLink />
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

          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.proposal} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
            <BroaderDoeVisionProposalQuote />
          </div>

          <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_PROPOSAL_CLOSING}</p>

          <figure
            id={tocIdFromLabel(BROADER_DOE_VISION_THESIS_SECTION_HEADLINE)}
            className={`m-0 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}
          >
            <figcaption
              className={`${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW} ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW}`}
            >
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

          <PremedEarlyStageLinks />

          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.contact} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
            <PremedEmailInvite />
          </div>

          <BlogArticleFooterCarouselBand>
            <BlogArticleRelatedCarousel currentSlug="the-broader-doe-vision" />
          </BlogArticleFooterCarouselBand>
        </div>
      </div>
    </div>
  );
}
