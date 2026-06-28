"use client";

import { ArticleInlineVisual } from "@/components/blog/ArticleInlineVisual";
import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW,
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_H2_TW,
  ABOUT_DESKTOP_ARTICLE_LIST_GAP,
  ABOUT_DESKTOP_ARTICLE_QUOTE_TW,
  ABOUT_DESKTOP_ARTICLE_SECTION_GAP,
  ABOUT_DESKTOP_ARTICLE_VISUAL_GAP,
} from "@/lib/about/about-layout-styles";
import { BLOG_ARTICLE_BODY_TW } from "@/lib/blog/blog-layout-styles";
import { dmSans, inter, lora } from "@/lib/home/fonts";
import type { ArticleBlock } from "@/lib/blog/articles";

const MOBILE_SECTION_GAP = "mt-10 iphone-page:mt-12";
const MOBILE_VISUAL_GAP = "mt-10 iphone-page:mt-12";

export type ArticleBodyLayout = "mobile" | "desktop";

export function renderArticleBlock(
  block: ArticleBlock,
  index: number,
  layout: ArticleBodyLayout = "mobile",
) {
  const isDesktop = layout === "desktop";
  const sectionGap = isDesktop ? ABOUT_DESKTOP_ARTICLE_SECTION_GAP : MOBILE_SECTION_GAP;
  const visualGap = isDesktop ? ABOUT_DESKTOP_ARTICLE_VISUAL_GAP : MOBILE_VISUAL_GAP;
  const bodyTw = isDesktop ? ABOUT_DESKTOP_ARTICLE_BODY_TW : BLOG_ARTICLE_BODY_TW;

  switch (block.type) {
    case "p":
      return (
        <p key={index} className={`${bodyTw} ${index === 0 ? "" : sectionGap}`}>
          {block.text}
        </p>
      );

    case "p-link": {
      const before = block.text.slice(0, block.text.indexOf(block.linkAnchor));
      const after = block.text.slice(block.text.indexOf(block.linkAnchor) + block.linkAnchor.length);
      return (
        <p key={index} className={`${bodyTw} ${sectionGap}`}>
          {before}
          <a
            href={block.linkHref}
            className="font-medium text-[#1E343A] underline decoration-[#1E343A]/35 underline-offset-[0.28em] transition-colors hover:decoration-[#1E343A]/70"
          >
            {block.linkAnchor}
          </a>
          {after}
        </p>
      );
    }

    case "h2":
      return (
        <h2
          key={index}
          className={
            isDesktop
              ? `${sectionGap} ${ABOUT_DESKTOP_ARTICLE_H2_TW}`
              : `${sectionGap} text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.35rem,1.1rem+1.1vmin,1.72rem)] iphone-page:text-[clamp(1.52rem,1.25rem+1.35vmin,1.95rem)] ${dmSans.className}`
          }
        >
          {block.text}
        </h2>
      );

    case "ul":
      return (
        <ul
          key={index}
          className={`${sectionGap} ${isDesktop ? ABOUT_DESKTOP_ARTICLE_LIST_GAP : "space-y-2.5 iphone-page:space-y-3"} pl-0 list-none`}
        >
          {block.items.map((item, i) => (
            <li key={i} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 ${bodyTw} !mt-0`}>
              <span className="flex h-[1lh] items-center" aria-hidden>
                <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#9A8F82]" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <div key={index} className={visualGap}>
          <ArticleInlineVisual design={block.design} />
        </div>
      );

    case "bar-chart":
      return (
        <ArticleBarChart
          key={index}
          title={block.title}
          caption={block.caption}
          citation={block.citation}
          bars={block.bars}
          layout={layout}
        />
      );

    case "pie-chart":
      return (
        <ArticlePieChart
          key={index}
          title={block.title}
          caption={block.caption}
          citation={block.citation}
          slices={block.slices}
          layout={layout}
        />
      );

    case "quote": {
      const parts = block.text.split(/\.\s+/);
      const [firstSentence, ...rest] = parts;
      const restText = rest.join(". ");
      return (
        <div key={index} className={`${visualGap} flex w-full justify-center`}>
          <div className="text-left">
            <blockquote
              className={
                isDesktop
                  ? ABOUT_DESKTOP_ARTICLE_QUOTE_TW
                  : `font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.62rem,1.3rem+1.45vmin,2.1rem)] iphone-page:text-[clamp(1.85rem,1.45rem+2vmin,2.6rem)] ${lora.className}`
              }
            >
              <span className="block">&ldquo;{firstSentence}.</span>
              {restText ? <span className="block">{restText}&rdquo;</span> : null}
            </blockquote>
            {block.attribution ? (
              <p
                className={
                  isDesktop
                    ? ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW
                    : `mt-4 iphone-page:mt-5 font-medium text-[#9A8F82] text-[clamp(1.08rem,0.95rem+0.55vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.05rem+0.8vmin,1.48rem)] ${dmSans.className}`
                }
              >
                {block.attribution}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
