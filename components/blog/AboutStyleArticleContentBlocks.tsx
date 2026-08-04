"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { aboutStyleFeatureShaderSurface } from "@/lib/blog/about-style-feature-card";
import type { AboutStyleArticleContentBlock } from "@/lib/blog/about-style-article-content-blocks";
import {
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

/** Longform blocks — paragraphs, section subheadings, shader figures with small captions. */
export function AboutStyleArticleContentBlocks({ blocks }: AboutStyleArticleContentBlocksProps) {
  return (
    <div className="about-style-article-blocks space-y-8 iphone-page:space-y-9">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <p key={block.text} className={BROADER_DOE_VISION_BODY_TW}>
              {block.text}
            </p>
          );
        }

        if (block.type === "subheading") {
          return (
            <figure key={block.text} className="m-0">
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

        const shader = aboutStyleFeatureShaderSurface(block.shaderVariant);

        return (
          <figure key={block.id} className="about-style-shader-figure m-0">
            <div
              className={`about-style-shader-figure__shader relative aspect-square w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
              style={{ backgroundColor: shader.colorBack }}
              aria-hidden
            >
              <ProtoGrainGradient
                static
                variant={shader.variant}
                colors={shader.colors}
                colorBack={shader.colorBack}
                className="absolute inset-0 h-full w-full"
              />
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
