"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import {
  aboutStyleFeatureShaderSurface,
  type AboutStyleFeatureCard,
} from "@/lib/blog/about-style-feature-card";
import {
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";

type AboutStyleFeatureCardGridProps = {
  cards: readonly AboutStyleFeatureCard[];
};

/** Square motionless shader tiles with thesis-style subheading + body copy beneath each. */
export function AboutStyleFeatureCardGrid({ cards }: AboutStyleFeatureCardGridProps) {
  return (
    <section className="about-style-feature-cards space-y-10 iphone-page:space-y-12" aria-label="Product highlights">
      {cards.map((card) => {
        const shader = aboutStyleFeatureShaderSurface(card.shaderVariant);

        return (
          <article key={card.id} className="about-style-feature-card">
            <div
              className={`about-style-feature-card__shader relative aspect-square w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
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

            <figure className="about-style-feature-card__copy m-0">
              <figcaption
                className={`${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW} ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW} mt-5 iphone-page:mt-6 mb-0`}
              >
                {card.subheading}
              </figcaption>

              <p className={`${BROADER_DOE_VISION_BODY_TW} mt-3 iphone-page:mt-4`}>{card.description}</p>
            </figure>
          </article>
        );
      })}
    </section>
  );
}
