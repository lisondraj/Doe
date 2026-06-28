"use client";

import { ArticleInlineVisual } from "@/components/blog/ArticleInlineVisual";
import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { BLOG_ARTICLE_BODY_TW } from "@/lib/blog/blog-layout-styles";
import { dmSans, inter, lora } from "@/lib/home/fonts";
import type { ArticleBlock } from "@/lib/blog/articles";

const SECTION_GAP = "mt-10 iphone-page:mt-12";
const VISUAL_GAP = "mt-10 iphone-page:mt-12";

export function renderArticleBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={index} className={`${BLOG_ARTICLE_BODY_TW} ${index === 0 ? "" : SECTION_GAP}`}>
          {block.text}
        </p>
      );

    case "p-link": {
      const before = block.text.slice(0, block.text.indexOf(block.linkAnchor));
      const after = block.text.slice(block.text.indexOf(block.linkAnchor) + block.linkAnchor.length);
      return (
        <p key={index} className={`${BLOG_ARTICLE_BODY_TW} ${SECTION_GAP}`}>
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
          className={`${SECTION_GAP} text-left font-semibold leading-[1.15] tracking-[-0.01em] text-[#1E343A] text-[clamp(1.35rem,1.1rem+1.1vmin,1.72rem)] iphone-page:text-[clamp(1.52rem,1.25rem+1.35vmin,1.95rem)] ${dmSans.className}`}
        >
          {block.text}
        </h2>
      );

    case "ul":
      return (
        <ul key={index} className={`${SECTION_GAP} space-y-2.5 iphone-page:space-y-3 pl-0 list-none`}>
          {block.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 ${BLOG_ARTICLE_BODY_TW} !mt-0`}>
              <span className="mt-[0.35em] shrink-0 h-[0.45em] w-[0.45em] rounded-full bg-[#9A8F82]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <div key={index} className={VISUAL_GAP}>
          <ArticleInlineVisual design={block.design} />
        </div>
      );

    case "bar-chart":
      return (
        <ArticleBarChart
          key={index}
          title={block.title}
          caption={block.caption}
          bars={block.bars}
        />
      );

    case "quote": {
      const parts = block.text.split(/\.\s+/);
      const [firstSentence, ...rest] = parts;
      const restText = rest.join(". ");
      return (
        <div key={index} className={`${VISUAL_GAP} flex w-full justify-center`}>
          <div className="text-left">
            <blockquote
              className={`font-normal leading-[1.22] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.62rem,1.3rem+1.45vmin,2.1rem)] iphone-page:text-[clamp(1.85rem,1.45rem+2vmin,2.6rem)] ${lora.className}`}
            >
              <span className="block">&ldquo;{firstSentence}.</span>
              {restText ? <span className="block">{restText}&rdquo;</span> : null}
            </blockquote>
            {block.attribution ? (
              <p
                className={`mt-4 iphone-page:mt-5 font-medium text-[#9A8F82] text-[clamp(1.08rem,0.95rem+0.55vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.05rem+0.8vmin,1.48rem)] ${dmSans.className}`}
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
