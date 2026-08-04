"use client";

import { useRef } from "react";

import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import { ABOUT_STYLE_ARTICLE_AUDIO, ABOUT_STYLE_ARTICLE_TOC_LABEL } from "@/lib/blog/about-style-article-toc";
import {
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_AUDIO_DIVIDER_TW,
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_AUDIO_TW,
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_INDEX_TW,
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_LABEL_TW,
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_LINK_TW,
  ABOUT_STYLE_ARTICLE_DESKTOP_TOC_TEXT_TW,
  ABOUT_STYLE_ARTICLE_TOC_AUDIO_DIVIDER_TW,
  ABOUT_STYLE_ARTICLE_TOC_AUDIO_TW,
  ABOUT_STYLE_ARTICLE_TOC_BOX_TW,
  ABOUT_STYLE_ARTICLE_TOC_INDEX_TW,
  ABOUT_STYLE_ARTICLE_TOC_LABEL_TW,
  ABOUT_STYLE_ARTICLE_TOC_LINK_TW,
  ABOUT_STYLE_ARTICLE_TOC_LIST_TW,
  ABOUT_STYLE_ARTICLE_TOC_TEXT_TW,
} from "@/lib/blog/about-style-article-toc-layout-styles";

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0 text-[rgba(198,168,132,0.55)] transition-colors duration-200 group-active:text-[rgba(232,192,142,0.82)] group-hover:text-[rgba(232,192,142,0.82)]"
    >
      <path
        d="M4.25 2.5 7.75 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" aria-hidden className="ml-px">
      <path
        d="M2.5 1.85c0-.72.82-.34 1.3-.06l5.3 3.02c.48.28.48.97 0 1.25l-5.3 3.02c-.48.28-1.3-.1-1.3-.82V1.85Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArticleAudioCopy({ variant }: { variant: "inline" | "nav" | "desktop" }) {
  if (variant === "nav") {
    return (
      <span className="about-style-article-floating-toc__audio-copy">
        {ABOUT_STYLE_ARTICLE_AUDIO.navLines.map((line) => (
          <span key={line} className="about-style-article-floating-toc__audio-line">
            {line}
          </span>
        ))}
      </span>
    );
  }

  return <span>{ABOUT_STYLE_ARTICLE_AUDIO.label}</span>;
}

function ArticleAudioRow({
  audioSrc,
  variant,
}: {
  audioSrc?: string;
  variant: "inline" | "nav" | "desktop";
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playIcon = (
    <span
      className={
        variant === "nav"
          ? "about-style-article-floating-toc__play-icon"
          : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(212,165,116,0.35)] text-[rgba(198,168,132,0.62)]"
      }
    >
      <PlayIcon size={variant === "nav" ? 13 : 11} />
    </span>
  );
  const rowClass =
    variant === "nav"
      ? "about-style-article-floating-toc__audio"
      : variant === "desktop"
        ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_AUDIO_TW
        : ABOUT_STYLE_ARTICLE_TOC_AUDIO_TW;

  if (audioSrc) {
    return (
      <button
        type="button"
        className={rowClass}
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (audio.paused) {
            void audio.play();
          } else {
            audio.pause();
          }
        }}
      >
        {playIcon}
        <ArticleAudioCopy variant={variant} />
        <audio ref={audioRef} src={audioSrc} preload="metadata" className="hidden" />
      </button>
    );
  }

  return (
    <p className={rowClass}>
      {playIcon}
      <ArticleAudioCopy variant={variant} />
    </p>
  );
}

type AboutStyleArticleTocPanelProps = {
  items: readonly AboutStyleArticleTocItem[];
  variant?: "inline" | "nav" | "desktop";
  omitLabel?: boolean;
  onItemClick?: () => void;
  audioSrc?: string;
};

/** Shared TOC list for inline, floating, and desktop sidebar panels. */
export function AboutStyleArticleTocPanel({
  items,
  variant = "inline",
  omitLabel = false,
  onItemClick,
  audioSrc = ABOUT_STYLE_ARTICLE_AUDIO.src,
}: AboutStyleArticleTocPanelProps) {
  const isNav = variant === "nav";
  const isDesktop = variant === "desktop";

  const labelClass = isDesktop
    ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_LABEL_TW
    : isNav
      ? "about-style-article-floating-toc__label"
      : ABOUT_STYLE_ARTICLE_TOC_LABEL_TW;

  const listClass = isNav ? "about-style-article-floating-toc__list" : ABOUT_STYLE_ARTICLE_TOC_LIST_TW;

  const linkClass = isDesktop
    ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_LINK_TW
    : isNav
      ? "about-style-article-floating-toc__link group"
      : ABOUT_STYLE_ARTICLE_TOC_LINK_TW;

  const indexClass = isDesktop
    ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_INDEX_TW
    : isNav
      ? "about-style-article-floating-toc__index"
      : ABOUT_STYLE_ARTICLE_TOC_INDEX_TW;

  const textClass = isDesktop
    ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_TEXT_TW
    : isNav
      ? "about-style-article-floating-toc__text"
      : ABOUT_STYLE_ARTICLE_TOC_TEXT_TW;

  const audioDividerClass = isNav
    ? "about-style-article-floating-toc__audio-divider"
    : isDesktop
      ? ABOUT_STYLE_ARTICLE_DESKTOP_TOC_AUDIO_DIVIDER_TW
      : ABOUT_STYLE_ARTICLE_TOC_AUDIO_DIVIDER_TW;

  const content = (
    <>
      {!omitLabel ? <p className={labelClass}>{ABOUT_STYLE_ARTICLE_TOC_LABEL}</p> : null}

      <ol className={listClass}>
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={linkClass} onClick={onItemClick}>
              <span className={indexClass}>{String(index + 1).padStart(2, "0")}</span>
              <span className={textClass}>{item.label}</span>
              {!isDesktop ? <ChevronIcon /> : null}
            </a>
          </li>
        ))}
      </ol>

      <div className={audioDividerClass}>
        <ArticleAudioRow audioSrc={audioSrc} variant={variant} />
      </div>
    </>
  );

  if (isNav) {
    return <div className="about-style-article-floating-toc__list-wrap">{content}</div>;
  }

  if (isDesktop) {
    return <div className="about-style-article-desktop-toc__panel">{content}</div>;
  }

  return <div className={ABOUT_STYLE_ARTICLE_TOC_BOX_TW}>{content}</div>;
}
