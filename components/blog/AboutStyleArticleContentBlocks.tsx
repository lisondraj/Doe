"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { aboutStyleFeatureShaderSurface } from "@/lib/blog/about-style-feature-card";
import type { AboutStyleArticleContentBlock } from "@/lib/blog/about-style-article-content-blocks";
import {
  ABOUT_STYLE_ARTICLE_SUBHEADING_TW,
  ABOUT_STYLE_SHADER_CAPTION_TW,
  BROADER_DOE_VISION_BODY_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";

type AboutStyleArticleContentBlocksProps = {
  blocks: readonly AboutStyleArticleContentBlock[];
};

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
            <h2 key={block.text} className={ABOUT_STYLE_ARTICLE_SUBHEADING_TW}>
              {block.text}
            </h2>
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
