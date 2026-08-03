import { AboutStyleContactLink } from "@/components/blog/AboutStyleContactLink";
import { AboutStyleArticleEmailInvite } from "@/components/blog/AboutStyleArticleEmailInvite";
import { AboutStyleArticleProposalQuote } from "@/components/blog/AboutStyleArticleProposalQuote";
import { AboutStyleFeatureCardGrid } from "@/components/blog/AboutStyleFeatureCardGrid";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_LIST_GAP,
  ABOUT_MOBILE_SECTION_GAP,
  ABOUT_PAGE_HERO_BOX_TW,
} from "@/lib/about/about-layout-styles";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
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
  ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW,
  isAboutStyleProductIntro,
} from "@/lib/blog/broader-doe-vision-layout-styles";

type AboutStyleArticlePageContentProps = {
  article: AboutStyleLongformArticle;
};

/** /about-style longform article — hero, shader band, body, quote, thesis list, email invite. */
export function AboutStyleArticlePageContent({ article }: AboutStyleArticlePageContentProps) {
  const productIntro = isAboutStyleProductIntro(article.slug);

  if (productIntro) {
    return (
      <div className="about-page-content about-style-product-intro-page">
        <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
          <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
            <h1 className={`${BROADER_DOE_VISION_TITLE_TW} ${ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW}`}>
              {article.title}
            </h1>

            <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>{article.subheading}</p>

            <p className={BROADER_DOE_VISION_BYLINE_TW}>
              {article.byline}
              <span className="mx-2" aria-hidden>
                ·
              </span>
              {article.date}
            </p>
          </div>
        </header>

        <div className={BROADER_DOE_VISION_HERO_WRAP}>
          <BlogHeroVisual
            backdrop={article.heroBackdrop}
            variant="hero"
            boxClassName={ABOUT_PAGE_HERO_BOX_TW}
            gapClassName=""
            useAboutHeroDuskShader
          />
        </div>

        <div className={`${ABOUT_MOBILE_CONTENT_GAP} mt-8 text-left iphone-page:mt-9`}>
          <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body font-semibold`}>
            {article.openingLede}
          </p>
          {article.openingLedeContinuation ? (
            <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body`}>
              {article.openingLedeContinuation}
            </p>
          ) : null}
        </div>

        {article.featureCards && article.featureCards.length > 0 ? (
          <div className="mt-10 iphone-page:mt-12">
            <AboutStyleFeatureCardGrid cards={article.featureCards} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="about-page-content">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <h1 className={BROADER_DOE_VISION_TITLE_TW}>{article.title}</h1>

          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>{article.subheading}</p>

          <p className={BROADER_DOE_VISION_BYLINE_TW}>
            {article.byline}
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {article.date}
          </p>
        </div>
      </header>

      <div className={BROADER_DOE_VISION_HERO_WRAP}>
        <BlogHeroVisual
          backdrop={article.heroBackdrop}
          variant="hero"
          boxClassName={ABOUT_PAGE_HERO_BOX_TW}
          gapClassName=""
          useAboutHeroDuskShader
        />
      </div>

      {article.featureCards && article.featureCards.length > 0 ? (
        <div className="mt-10 mb-14 iphone-page:mt-12 iphone-page:mb-16">
          <AboutStyleFeatureCardGrid cards={article.featureCards} />
        </div>
      ) : null}

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{article.openingLede}</p>

          {article.bodyParagraphs.map((paragraph, index) => (
            <p key={paragraph} className={BROADER_DOE_VISION_BODY_TW}>
              {index === article.contactParagraphIndex ? (
                <>
                  <span className="broader-doe-thesis-text">{paragraph}</span>
                  <span className="inline-block pl-1 align-baseline">
                    <AboutStyleContactLink />
                  </span>
                </>
              ) : index === article.aiPlaybookParagraphIndex && article.aiPlaybookParagraph ? (
                <>
                  {article.aiPlaybookParagraph.before}
                  <span className="font-semibold">{article.aiPlaybookParagraph.bold}</span>
                  {article.aiPlaybookParagraph.after}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}

          <AboutStyleArticleProposalQuote
            lead={article.proposalHighlightLead}
            continuation={article.proposalHighlightContinuation}
          />

          <p className={BROADER_DOE_VISION_BODY_TW}>{article.proposalClosing}</p>

          <figure className="m-0">
            <figcaption className={BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW}>
              {article.thesisSectionHeadline}
            </figcaption>
            <p className={`${BROADER_DOE_VISION_BODY_TW} !mt-0`}>{article.thesisIntro}</p>
          </figure>

          <ol className={`${BROADER_DOE_VISION_THESIS_LIST_TW} ${ABOUT_MOBILE_LIST_GAP}`}>
            {article.thesisPoints.map((point, index) => (
              <li
                key={point}
                className={`${BROADER_DOE_VISION_THESIS_ITEM_TW} grid grid-cols-[1.35em_minmax(0,1fr)] gap-x-0`}
              >
                <span className="broader-doe-thesis-text">{index + 1}.</span>
                <span className="broader-doe-thesis-text">{point}</span>
              </li>
            ))}
          </ol>

          <p className={BROADER_DOE_VISION_BODY_TW}>{article.closing}</p>

          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{article.finalParagraph}</p>

          <AboutStyleArticleEmailInvite headline={article.emailInviteHeadline} label={article.emailInviteLabel} />
        </div>
      </div>
    </div>
  );
}
