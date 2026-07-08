"use client";

import Link from "next/link";

import { DoePhoneClosingBandVisual } from "@/components/doephone/DoePhoneClosingBandVisual";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW,
} from "@/lib/doephone/section-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

const CLOSING_FEATURE_ARTICLES = BLOG_ARTICLES.slice(0, 3);
const CLOSING_LINE_GRAPHICS = JOIN_INTERN_TRACKS.slice(0, 3);

/** Three stacked feature cards with captions — no carousel. */
export function DoePhoneClosingFeatureStack({
  variant = "mobile",
}: {
  variant?: "mobile" | "desktop";
}) {
  const isDesktop = variant === "desktop";
  const itemGap = isDesktop ? "space-y-3 md:space-y-4" : "space-y-3 iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]";
  const stackGap = isDesktop ? "mt-8 md:mt-10 lg:mt-12" : DOEPHONE_SECTION_CAROUSEL_MENU_GAP;

  return (
    <div className="flex flex-col" aria-label="Featured updates">
      {CLOSING_FEATURE_ARTICLES.map((article, index) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className={`group block no-underline ${itemGap}${
            index > 0 ? ` ${stackGap}` : ""
          }`}
        >
          <DoePhoneClosingBandVisual graphic={CLOSING_LINE_GRAPHICS[index].graphic} />
          <p className={`text-left ${DOEPHONE_SECTION_FOOTER_OUTSIDE_CAPTION_TW} transition-colors group-active:opacity-70`}>
            {article.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
