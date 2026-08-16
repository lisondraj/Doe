import { AboutStyleArticleContentBlocks } from "@/components/blog/AboutStyleArticleContentBlocks";
import { AboutStyleContactLink } from "@/components/blog/AboutStyleContactLink";
import { AboutStyleArticleEmailInvite } from "@/components/blog/AboutStyleArticleEmailInvite";
import { AboutStyleArticleProposalQuote } from "@/components/blog/AboutStyleArticleProposalQuote";
import { AboutStyleArticleTableOfContents } from "@/components/blog/AboutStyleArticleTableOfContents";
import { AboutStyleFeatureCardGrid } from "@/components/blog/AboutStyleFeatureCardGrid";
import { BlogArticleFooterCarouselBand } from "@/components/blog/BlogArticleFooterCarouselBand";
import { BlogArticleCategory } from "@/components/blog/BlogArticleCategory";
import { BlogArticleRelatedCarousel } from "@/components/blog/BlogArticleRelatedCarousel";
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
import { blogPostCategory } from "@/lib/blog/blog-post-categories";
import {
  ABOUT_STYLE_ARTICLE_SECTION_ANCHOR,
  ABOUT_STYLE_ARTICLE_TOC_IDS,
  type AboutStyleArticleTocItem,
} from "@/lib/blog/about-style-article-toc";
import { BLOG_ABOUT_HERO_BACKDROP } from "@/lib/blog/blog-about-shader-backdrops";
import { OUR_FOUNDER_STORY_SLUG } from "@/lib/blog/our-founder-story-article";

type AboutStyleArticlePageContentProps = {
  article: AboutStyleLongformArticle;
  tocItems: readonly AboutStyleArticleTocItem[];
};

function AboutStyleArticleSubheading({ article }: { article: AboutStyleLongformArticle }) {
  const founderStorySubheading =
    article.slug === "our-founder-story" ? " about-style-hero-subheading--founder-story" : "";

  return (
    <p
      className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]${founderStorySubheading}`}
    >
      {article.subheading}
      {article.subheadingLine2 ? (
        <>
          <br />
          {article.subheadingLine2}
        </>
      ) : null}
    </p>
  );
}

/** /about-style longform article — hero, shader band, body, quote, thesis list, email invite. */
export function AboutStyleArticlePageContent({ article, tocItems }: AboutStyleArticlePageContentProps) {
  const productIntro = isAboutStyleProductIntro(article.slug);
  const labsProposal = article.contentBlocks != null && article.contentBlocks.length > 0;
  const category = blogPostCategory(article.slug);
  const useBakedShaderBackdrops = article.slug === OUR_FOUNDER_STORY_SLUG;
  const heroBackdropImageSrc = useBakedShaderBackdrops ? BLOG_ABOUT_HERO_BACKDROP : undefined;

  const titleContent = article.titleLine2 ? (
    <>
      <span className="broader-doe-hero-title-line block">{article.title}</span>
      <span className="broader-doe-hero-title-line block">{article.titleLine2}</span>
    </>
  ) : (
    article.title
  );

  if (labsProposal) {
    return (
      <div className="about-page-content about-style-labs-proposal-page">
        <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
          <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
            {category ? <BlogArticleCategory category={category} /> : null}
            <h1 className={`${BROADER_DOE_VISION_TITLE_TW} ${ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW}`}>{titleContent}</h1>

            <AboutStyleArticleSubheading article={article} />

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
            backdropImageSrc={heroBackdropImageSrc}
            variant="hero"
            boxClassName={ABOUT_PAGE_HERO_BOX_TW}
            gapClassName=""
            useAboutHeroDuskShader
          />
        </div>

        <AboutStyleArticleTableOfContents items={tocItems} />

        <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.intro} className={`${ABOUT_MOBILE_CONTENT_GAP} mt-8 text-left iphone-page:mt-9 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}>
          <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{article.openingLede}</p>
          {article.openingLedeContinuation ? (
            <p className={BROADER_DOE_VISION_BODY_TW}>{article.openingLedeContinuation}</p>
          ) : null}
          {article.openingLedeContinuation2 ? (
            <p className={BROADER_DOE_VISION_BODY_TW}>{article.openingLedeContinuation2}</p>
          ) : null}
        </div>

        {article.contentBlocks ? (
          <div className={`${ABOUT_MOBILE_SECTION_GAP} mt-10 iphone-page:mt-12`}>
            <AboutStyleArticleContentBlocks
              blocks={article.contentBlocks}
              useBakedShaderBackdrops={useBakedShaderBackdrops}
            />
          </div>
        ) : null}

        <div className={`${ABOUT_MOBILE_SECTION_GAP} mt-10 iphone-page:mt-12`}>
          <div className={ABOUT_MOBILE_CONTENT_GAP}>
            <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{article.finalParagraph}</p>

            <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.contact} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
              <AboutStyleArticleEmailInvite headline={article.emailInviteHeadline} label={article.emailInviteLabel} />
            </div>

            <BlogArticleFooterCarouselBand>
              <BlogArticleRelatedCarousel
                currentSlug={article.slug}
                useBakedShaderBackdrops={useBakedShaderBackdrops}
              />
            </BlogArticleFooterCarouselBand>
          </div>
        </div>
      </div>
    );
  }

  if (productIntro) {
    return (
      <div className="about-page-content about-style-product-intro-page">
        <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
          <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
            {category ? <BlogArticleCategory category={category} /> : null}
            <h1 className={`${BROADER_DOE_VISION_TITLE_TW} ${ABOUT_STYLE_PRODUCT_INTRO_TITLE_TW}`}>
              {titleContent}
            </h1>

            <AboutStyleArticleSubheading article={article} />

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
            backdropImageSrc={heroBackdropImageSrc}
            variant="hero"
            boxClassName={ABOUT_PAGE_HERO_BOX_TW}
            gapClassName=""
            useAboutHeroDuskShader
          />
        </div>

        <AboutStyleArticleTableOfContents items={tocItems} />

        <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.intro} className={`${ABOUT_MOBILE_CONTENT_GAP} mt-8 text-left iphone-page:mt-9 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}>
          <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body font-semibold`}>
            {article.openingLede}
          </p>
          {article.openingLedeContinuation ? (
            <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body`}>
              {article.openingLedeContinuation}
            </p>
          ) : null}
          {article.openingLedeContinuation2 ? (
            <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body`}>
              {article.openingLedeContinuation2}
            </p>
          ) : null}
        </div>

        {article.featureCards && article.featureCards.length > 0 ? (
          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.features} className={`mt-10 iphone-page:mt-12 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}>
            <AboutStyleFeatureCardGrid cards={article.featureCards} />
          </div>
        ) : null}

        <div className={`${ABOUT_MOBILE_SECTION_GAP} mt-10 iphone-page:mt-12`}>
          <div className={ABOUT_MOBILE_CONTENT_GAP}>
            <p className={`${BROADER_DOE_VISION_BODY_TW} about-style-product-intro-body font-semibold`}>
              {article.finalParagraph}
            </p>

            <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.contact} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
              <AboutStyleArticleEmailInvite headline={article.emailInviteHeadline} label={article.emailInviteLabel} />
            </div>

            <BlogArticleFooterCarouselBand>
              <BlogArticleRelatedCarousel
                currentSlug={article.slug}
                useBakedShaderBackdrops={useBakedShaderBackdrops}
              />
            </BlogArticleFooterCarouselBand>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page-content">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          {category ? <BlogArticleCategory category={category} /> : null}
          <h1 className={BROADER_DOE_VISION_TITLE_TW}>{titleContent}</h1>

          <AboutStyleArticleSubheading article={article} />

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
          backdropImageSrc={heroBackdropImageSrc}
          variant="hero"
          boxClassName={ABOUT_PAGE_HERO_BOX_TW}
          gapClassName=""
          useAboutHeroDuskShader
        />
      </div>

      <AboutStyleArticleTableOfContents items={tocItems} />

      {article.featureCards && article.featureCards.length > 0 ? (
        <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.features} className={`mt-10 mb-14 iphone-page:mt-12 iphone-page:mb-16 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}>
          <AboutStyleFeatureCardGrid cards={article.featureCards} />
        </div>
      ) : null}

      <div className={ABOUT_MOBILE_SECTION_GAP}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.intro} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
            <p className={`${BROADER_DOE_VISION_BODY_TW} font-semibold`}>{article.openingLede}</p>
          </div>

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

          <figure id={ABOUT_STYLE_ARTICLE_TOC_IDS.thesis} className={`m-0 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}>
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

          <div id={ABOUT_STYLE_ARTICLE_TOC_IDS.contact} className={ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}>
            <AboutStyleArticleEmailInvite headline={article.emailInviteHeadline} label={article.emailInviteLabel} />
          </div>

          <BlogArticleFooterCarouselBand>
            <BlogArticleRelatedCarousel
              currentSlug={article.slug}
              useBakedShaderBackdrops={useBakedShaderBackdrops}
            />
          </BlogArticleFooterCarouselBand>
        </div>
      </div>
    </div>
  );
}
