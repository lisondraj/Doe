"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AboutStyleArticleFloatingBlogPanel } from "@/components/blog/AboutStyleArticleFloatingBlogPanel";

const PANEL_REVEAL_MS = 780;
const PANEL_HIDE_MS = 180;
const PANEL_COLLAPSE_MS = 520;
const SCROLL_REVEAL_PX = 280;

function BlogNavIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="about-style-article-floating-blog-nav__icon"
    >
      <rect x="3.25" y="4.25" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="11.65" y="4.25" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="3.25" y="11.65" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="11.65" y="11.65" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

type AboutStyleArticleFloatingBlogNavProps = {
  currentSlug?: string;
};

/** Frosted blog index circle fixed bottom-left; appears after scrolling past the hero. */
export function AboutStyleArticleFloatingBlogNav({ currentSlug }: AboutStyleArticleFloatingBlogNavProps) {
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

  const openPanel = useCallback(() => {
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

  const togglePanel = useCallback(() => {
    if (open) {
      close();
    } else {
      openPanel();
    }
  }, [close, open, openPanel]);

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

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={rootRef}
      className={`about-style-article-floating-blog-nav${scrollRevealed ? " is-visible" : ""}${open && !collapsing ? " is-open" : ""}${panelRevealed ? " is-revealed" : ""}${collapsing ? " is-closing" : ""}`}
      aria-live="polite"
      aria-hidden={!scrollRevealed}
    >
      <div
        className="about-style-article-floating-blog-nav__frost proto-nav-frost-shell"
        style={{ ["--proto-nav-frost-progress" as string]: 1 }}
      >
        {open ? (
          <div className="about-style-article-floating-blog-nav__panel" aria-hidden={!panelRevealed}>
            <AboutStyleArticleFloatingBlogPanel currentSlug={currentSlug} onItemClick={close} />
          </div>
        ) : null}

        {!open && !collapsing ? (
          <button
            type="button"
            className="about-style-article-floating-blog-nav__trigger"
            aria-expanded={open}
            aria-label="Open blog posts"
            onClick={togglePanel}
            tabIndex={scrollRevealed ? 0 : -1}
          >
            <BlogNavIcon />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
