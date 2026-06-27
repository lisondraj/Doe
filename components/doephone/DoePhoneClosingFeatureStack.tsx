"use client";

import Link from "next/link";

import { DoePhoneClosingBandVisual } from "@/components/doephone/DoePhoneClosingBandVisual";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW,
} from "@/lib/doephone/section-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";
import { JOIN_MAIN_PAGE_CLOSING_VISUALS } from "@/lib/join/join-hero-backdrops";

const CLOSING_FEATURE_ARTICLES = BLOG_ARTICLES.slice(0, 3);

/** Three stacked feature cards with captions — no carousel. */
export function DoePhoneClosingFeatureStack() {
  return (
    <div className="flex flex-col" aria-label="Featured updates">
      {CLOSING_FEATURE_ARTICLES.map((article, index) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className={`group block no-underline space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]${
            index > 0 ? ` ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP}` : ""
          }`}
        >
          <DoePhoneClosingBandVisual
            backdrop={JOIN_MAIN_PAGE_CLOSING_VISUALS[index].backdrop}
            surface={JOIN_MAIN_PAGE_CLOSING_VISUALS[index].surface}
          />
          <p className={`text-left ${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW} transition-colors group-active:opacity-70`}>
            {article.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
