"use client";

import Link from "next/link";

import { ClinicSpecialtyWorkflowFigure } from "@/components/blog/ClinicSpecialtyWorkflowsArticle";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { BlogShaderBackdropImage } from "@/components/blog/BlogShaderBackdropImage";
import { aboutStyleFeatureShaderSurface } from "@/lib/blog/about-style-feature-card";
import { blogAboutFeatureShaderBackdrop } from "@/lib/blog/blog-about-shader-backdrops";
import type { AboutStyleArticleContentBlock } from "@/lib/blog/about-style-article-content-blocks";
import {
  ABOUT_STYLE_ARTICLE_SECTION_ANCHOR,
  tocIdFromLabel,
} from "@/lib/blog/about-style-article-toc";
import {
  ABOUT_STYLE_BULLET_ITEM_TW,
  ABOUT_STYLE_BULLET_LIST_TW,
  ABOUT_STYLE_GLOSSARY_DEFINITION_TW,
  ABOUT_STYLE_GLOSSARY_TERM_TW,
  ABOUT_STYLE_GLOSSARY_WRAP_TW,
  ABOUT_STYLE_SHADER_CAPTION_TW,
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_PROPOSAL_QUOTE_TW,
  BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";

type AboutStyleArticleContentBlocksProps = {
  blocks: readonly AboutStyleArticleContentBlock[];
  useBakedShaderBackdrops?: boolean;
};

/** Splits `**bold**` markers out of quote copy into bold spans. */
function renderBoldSegments(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((segment, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold">
        {segment}
      </strong>
    ) : (
      segment
    ),
  );
}

/** Longform blocks — paragraphs, gold paragraphs, glossary, bullets, pull quotes, subheadings, shader figures. */
export function AboutStyleArticleContentBlocks({
  blocks,
  useBakedShaderBackdrops = false,
}: AboutStyleArticleContentBlocksProps) {
  return (
    <div className="about-style-article-blocks space-y-8 iphone-page:space-y-9">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <p key={block.text} className={BROADER_DOE_VISION_BODY_TW}>
              {renderBoldSegments(block.text)}
            </p>
          );
        }

        if (block.type === "linkedParagraph") {
          return (
            <p key={block.id} className={BROADER_DOE_VISION_BODY_TW}>
              {block.before}
              <Link
                href={block.href}
                className="broader-doe-thesis-text underline decoration-[rgba(232,192,142,0.55)] underline-offset-4 transition-colors hover:decoration-[#E8C08E]"
              >
                {block.linkLabel}
              </Link>
              {block.after}
            </p>
          );
        }

        if (block.type === "goldParagraph") {
          return (
            <p key={block.text} className={BROADER_DOE_VISION_BODY_TW}>
              <span className="broader-doe-thesis-text">{block.text}</span>
            </p>
          );
        }

        if (block.type === "glossary") {
          return (
            <dl key={block.id} className={ABOUT_STYLE_GLOSSARY_WRAP_TW}>
              {block.entries.map((entry) => (
                <div key={entry.term}>
                  <dt className={ABOUT_STYLE_GLOSSARY_TERM_TW}>{entry.term}</dt>
                  <dd className={ABOUT_STYLE_GLOSSARY_DEFINITION_TW}>{entry.definition}</dd>
                </div>
              ))}
            </dl>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={block.id} className={ABOUT_STYLE_BULLET_LIST_TW}>
              {block.items.map((item) => (
                <li key={item} className={ABOUT_STYLE_BULLET_ITEM_TW}>
                  <span
                    className="absolute left-0 top-[0.62em] h-[6px] w-[6px] rounded-full bg-[#E8C08E]"
                    aria-hidden
                  />
                  {renderBoldSegments(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "subheading") {
          return (
            <figure
              key={block.text}
              id={tocIdFromLabel(block.text)}
              className={`m-0 ${ABOUT_STYLE_ARTICLE_SECTION_ANCHOR}`}
            >
              <figcaption
                className={`${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW} ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW}`}
              >
                {block.text}
              </figcaption>
            </figure>
          );
        }

        if (block.type === "quote") {
          const trimmedLead = block.lead.endsWith(".") ? block.lead.slice(0, -1) : block.lead;
          return (
            <figure key={block.id} className={BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP}>
              <blockquote className={BROADER_DOE_VISION_PROPOSAL_QUOTE_TW}>
                <span className="block">&ldquo;{renderBoldSegments(trimmedLead)}.</span>
                <span className="block mt-3 iphone-page:mt-3.5">
                  {renderBoldSegments(block.continuation)}&rdquo;
                </span>
              </blockquote>
            </figure>
          );
        }

        if (block.type === "doehomeScene") {
          return (
            <figure key={block.id} className="about-style-shader-figure m-0">
              <div
                className={`about-style-shader-figure__shader relative aspect-square w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
                aria-hidden
              >
                <ClinicSpecialtyWorkflowFigure
                  shaderSrc={block.shaderSrc}
                  specialty={block.specialty}
                  functionLabel={block.functionLabel}
                  details={block.details}
                />
              </div>
              <figcaption className={`${ABOUT_STYLE_SHADER_CAPTION_TW} mt-3 iphone-page:mt-4`}>
                {block.caption}
              </figcaption>
            </figure>
          );
        }

        const shader = aboutStyleFeatureShaderSurface(block.shaderVariant);
        const backdropSrc = useBakedShaderBackdrops
          ? blogAboutFeatureShaderBackdrop(block.shaderVariant)
          : undefined;

        return (
          <figure key={block.id} className="about-style-shader-figure m-0">
            <div
              className={`about-style-shader-figure__shader relative aspect-square w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
              style={{ backgroundColor: shader.colorBack }}
              aria-hidden
            >
              {backdropSrc ? (
                <BlogShaderBackdropImage src={backdropSrc} />
              ) : (
                <ProtoGrainGradient
                  static
                  variant={shader.variant}
                  colors={shader.colors}
                  colorBack={shader.colorBack}
                  className="absolute inset-0 h-full w-full"
                />
              )}
            </div>
            <figcaption className={`${ABOUT_STYLE_SHADER_CAPTION_TW} mt-3 iphone-page:mt-4`}>
              {block.caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
