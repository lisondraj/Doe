"use client";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_LIST_GAP,
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
        <li key={item} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 ${ABOUT_DESKTOP_ARTICLE_BODY_TW}`}>
          <span className="flex h-[1lh] items-center" aria-hidden>
            <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#9A8F82]" />
          </span>
          <span>{item}</span>
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
