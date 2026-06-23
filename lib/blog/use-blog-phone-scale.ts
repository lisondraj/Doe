"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/** Pro Max portrait CSS width — design reference pivot. */
export const BLOG_PHONE_REF_WIDTH = 430;

/** Minimum readable scale (≈ 236px effective width). */
export const BLOG_PHONE_SCALE_FLOOR = 0.55;

/** Minimum width used for scale measurement. */
export const BLOG_PHONE_MIN_WIDTH = 240;

export function blogPhoneScaleFromWidth(widthPx: number): number {
  const w = Math.max(BLOG_PHONE_MIN_WIDTH, widthPx);
  return Math.max(BLOG_PHONE_SCALE_FLOOR, Math.min(1, w / BLOG_PHONE_REF_WIDTH));
}

function readBlogViewportWidth(): number {
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  const candidates = [
    vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : 0,
    cw,
    iw,
  ].filter((n) => n > 0);
  return Math.max(BLOG_PHONE_MIN_WIDTH, Math.min(...candidates));
}

/**
 * Measures the blog shell width and returns a scale factor (430px = 1.0).
 * Also sets --blog-scale on documentElement for any CSS that reads it.
 */
export function useBlogPhoneScale(rootRef: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;

    const apply = () => {
      const el = rootRef.current;
      if (!el) return;

      /* Prefer the rendered content width — catches in-app browsers that lie about vw. */
      const measured =
        el.clientWidth > 0 ? el.clientWidth : readBlogViewportWidth();
      const width = Math.max(BLOG_PHONE_MIN_WIDTH, measured);
      const next = blogPhoneScaleFromWidth(width);

      setScale(next);
      html.style.setProperty("--blog-scale", String(next));
      html.style.setProperty("--blog-vw", `${width}px`);
      html.setAttribute("data-blog-route", "true");
    };

    apply();
    const raf = requestAnimationFrame(apply);

    const ro = new ResizeObserver(apply);
    ro.observe(root);

    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) apply();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
      html.style.removeProperty("--blog-scale");
      html.style.removeProperty("--blog-vw");
      html.removeAttribute("data-blog-route");
    };
  }, [rootRef]);

  return scale;
}
