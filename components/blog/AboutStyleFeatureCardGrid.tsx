"use client";

import { useState } from "react";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import {
  aboutStyleFeatureShaderSurface,
  ABOUT_STYLE_FEATURE_CARDS_INITIAL_VISIBLE,
  ABOUT_STYLE_FEATURE_CARDS_SECTION_LABEL,
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

function ExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`ml-1.5 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
    >
      <path
        d="M2.75 4.5 6 7.75 9.25 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutStyleFeatureCardItem({ card }: { card: AboutStyleFeatureCard }) {
  const shader = aboutStyleFeatureShaderSurface(card.shaderVariant);

  return (
    <article className="about-style-feature-card">
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
}

/** Square motionless shader tiles with thesis-style subheading + body copy beneath each. */
export function AboutStyleFeatureCardGrid({ cards }: AboutStyleFeatureCardGridProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = cards.length > ABOUT_STYLE_FEATURE_CARDS_INITIAL_VISIBLE;
  const initialCards = hasOverflow ? cards.slice(0, ABOUT_STYLE_FEATURE_CARDS_INITIAL_VISIBLE) : cards;
  const overflowCards = hasOverflow ? cards.slice(ABOUT_STYLE_FEATURE_CARDS_INITIAL_VISIBLE) : [];

  return (
    <section className="about-style-feature-cards" aria-label={ABOUT_STYLE_FEATURE_CARDS_SECTION_LABEL}>
      <h2
        className={`about-style-feature-cards__heading ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW} ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW} m-0`}
      >
        {ABOUT_STYLE_FEATURE_CARDS_SECTION_LABEL}
      </h2>

      <div className="about-style-feature-cards__primary space-y-10 iphone-page:space-y-12">
        {initialCards.map((card) => (
          <AboutStyleFeatureCardItem key={card.id} card={card} />
        ))}
      </div>

      {hasOverflow ? (
        <>
          <button
            type="button"
            className="about-style-feature-cards__expand"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Show less" : "See more highlights"}
            <ExpandChevron expanded={expanded} />
          </button>

          {expanded ? (
            <div className="about-style-feature-cards__more space-y-10 iphone-page:space-y-12">
              {overflowCards.map((card) => (
                <AboutStyleFeatureCardItem key={card.id} card={card} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
