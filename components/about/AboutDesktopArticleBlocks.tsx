"use client";

import {
  ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW,
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_LIST_GAP,
  ABOUT_DESKTOP_ARTICLE_QUOTE_TW,
  ABOUT_DESKTOP_STACK_GAP,
} from "@/lib/about/about-layout-styles";

export function AboutDesktopParagraph({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <p className={`${ABOUT_DESKTOP_ARTICLE_BODY_TW} ${className}`.trim()}>{text}</p>;
}

export function AboutDesktopBulletList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`${ABOUT_DESKTOP_ARTICLE_LIST_GAP} list-none pl-0 ${className}`.trim()}>
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 ${ABOUT_DESKTOP_ARTICLE_BODY_TW}`}>
          <span className="mt-[0.35em] shrink-0 h-[0.45em] w-[0.45em] rounded-full bg-[#9A8F82]" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AboutDesktopParagraphStack({
  paragraphs,
}: {
  paragraphs: readonly string[];
}) {
  return (
    <div className={`flex flex-col ${ABOUT_DESKTOP_STACK_GAP}`}>
      {paragraphs.map((text, index) => (
        <AboutDesktopParagraph key={`${index}-${text.slice(0, 24)}`} text={text} />
      ))}
    </div>
  );
}

export function AboutDesktopQuote({
  text,
  attribution,
  className = "",
}: {
  text: string;
  attribution?: string;
  className?: string;
}) {
  const parts = text.split(/\.\s+/);
  const [firstSentence, ...rest] = parts;
  const restText = rest.join(". ");

  return (
    <figure className={className}>
      <blockquote className={ABOUT_DESKTOP_ARTICLE_QUOTE_TW}>
        <span className="block">&ldquo;{firstSentence}.</span>
        {restText ? <span className="block">{restText}&rdquo;</span> : null}
      </blockquote>
      {attribution ? <figcaption className={ABOUT_DESKTOP_ARTICLE_ATTRIBUTION_TW}>{attribution}</figcaption> : null}
    </figure>
  );
}
