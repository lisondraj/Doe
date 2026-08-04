"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AboutStyleArticleTocPanel } from "@/components/blog/AboutStyleArticleTocPanel";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import { ABOUT_STYLE_ARTICLE_TOC_LABEL } from "@/lib/blog/about-style-article-toc";

const PANEL_REVEAL_MS = 780;
const PANEL_HIDE_MS = 180;
const PANEL_COLLAPSE_MS = 520;
const SCROLL_REVEAL_PX = 280;

function TocIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="about-style-article-floating-toc__icon"
    >
      <path
        d="M6.75 6.25h9.5M6.75 10h9.5M6.75 13.75H13"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <circle cx="4.65" cy="6.25" r="0.85" fill="currentColor" />
      <circle cx="4.65" cy="10" r="0.85" fill="currentColor" />
      <circle cx="4.65" cy="13.75" r="0.85" fill="currentColor" />
    </svg>
  );
}

type AboutStyleArticleFloatingTocProps = {
  items: readonly AboutStyleArticleTocItem[];
};

/** Frosted TOC circle fixed bottom-right; appears after scrolling past the hero. */
export function AboutStyleArticleFloatingToc({ items }: AboutStyleArticleFloatingTocProps) {
  const [mounted, setMounted] = useState(false);
  const [scrollRevealed, setScrollRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelRevealed, setPanelRevealed] = useState(false);
  const [collapsing, setCollapsing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const revealTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const collapseTimerRef = useRef<number | null>(null);

  const clearCollapseStyles = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.width = "";
    root.style.height = "";
  }, []);

  const beginCollapse = useCallback(() => {
    const root = rootRef.current;
    if (root) {
      const { width, height } = root.getBoundingClientRect();
      root.style.width = `${width}px`;
      root.style.height = `${height}px`;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCollapsing(true);
      });
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let raf = 0;

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const revealed = window.scrollY > SCROLL_REVEAL_PX;
        setScrollRevealed(revealed);
        if (!revealed) {
          setPanelRevealed(false);
          setOpen(false);
          setCollapsing(false);
          if (rootRef.current) {
            rootRef.current.style.width = "";
            rootRef.current.style.height = "";
          }
        }
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  const close = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    setPanelRevealed(false);
    hideTimerRef.current = window.setTimeout(() => {
      beginCollapse();
      hideTimerRef.current = null;
      collapseTimerRef.current = window.setTimeout(() => {
        setOpen(false);
        setCollapsing(false);
        clearCollapseStyles();
        collapseTimerRef.current = null;
      }, PANEL_COLLAPSE_MS);
    }, PANEL_HIDE_MS);
  }, [beginCollapse, clearCollapseStyles]);

  const openToc = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    setCollapsing(false);
    clearCollapseStyles();
    setOpen(true);
    setPanelRevealed(false);
    revealTimerRef.current = window.setTimeout(() => {
      setPanelRevealed(true);
      revealTimerRef.current = null;
    }, PANEL_REVEAL_MS);
  }, [clearCollapseStyles]);

  const toggleToc = useCallback(() => {
    if (open) {
      close();
    } else {
      openToc();
    }
  }, [close, open, openToc]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  if (!mounted || items.length === 0) {
    return null;
  }

  return createPortal(
    <div
      ref={rootRef}
      className={`about-style-article-floating-toc${scrollRevealed ? " is-visible" : ""}${open && !collapsing ? " is-open" : ""}${panelRevealed ? " is-revealed" : ""}${collapsing ? " is-closing" : ""}`}
      aria-live="polite"
      aria-hidden={!scrollRevealed}
    >
      <div
        className="about-style-article-floating-toc__frost proto-nav-frost-shell"
        style={{ ["--proto-nav-frost-progress" as string]: 1 }}
      >
        {open ? (
          <div className="about-style-article-floating-toc__panel" aria-hidden={!panelRevealed}>
            <p className="about-style-article-floating-toc__label">{ABOUT_STYLE_ARTICLE_TOC_LABEL}</p>
            <AboutStyleArticleTocPanel items={items} variant="nav" omitLabel onItemClick={close} />
          </div>
        ) : null}

        {!open && !collapsing ? (
          <button
            type="button"
            className="about-style-article-floating-toc__trigger"
            aria-expanded={open}
            aria-label="Open table of contents"
            onClick={toggleToc}
            tabIndex={scrollRevealed ? 0 : -1}
          >
            <TocIcon />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
