"use client";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW,
} from "@/lib/doephone/section-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

const CLOSING_FEATURE_ARTICLES = BLOG_ARTICLES.slice(0, 3);

/** Three stacked feature cards with captions — no carousel. */
export function DoePhoneClosingFeatureStack() {
  return (
    <div className="flex flex-col" aria-label="Featured updates">
      {CLOSING_FEATURE_ARTICLES.map((article, index) => (
        <div
          key={article.slug}
          className={`space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]${
            index > 0 ? ` ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP}` : ""
          }`}
        >
          <BlogHeroVisual backdrop={article.backdrop} variant="list" />
          <p className={`text-left ${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW}`}>{article.title}</p>
        </div>
      ))}
    </div>
  );
}
