"use client";

import { useLayoutEffect } from "react";

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
  const w =
    vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  return Math.max(w, BLOG_PHONE_MIN_WIDTH);
}

/**
 * Sets `--blog-scale` and `--blog-vw` on `documentElement` from measured
 * visualViewport width — reliable in in-app browsers where vw/rem lie.
 */
export function useBlogPhoneScale() {
  useLayoutEffect(() => {
    const html = document.documentElement;

    const apply = () => {
      const width = readBlogViewportWidth();
      const scale = blogPhoneScaleFromWidth(width);
      html.style.setProperty("--blog-scale", String(scale));
      html.style.setProperty("--blog-vw", `${width}px`);
      html.setAttribute("data-blog-route", "true");
    };

    apply();
    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);

    return () => {
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
      html.style.removeProperty("--blog-scale");
      html.style.removeProperty("--blog-vw");
      html.removeAttribute("data-blog-route");
    };
  }, []);
}
