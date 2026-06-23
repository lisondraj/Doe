"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/** Pro Max portrait CSS width — design reference pivot. */
export const BLOG_PHONE_REF_WIDTH = 430;

/** Minimum readable scale (≈ 236px effective width). */
export const BLOG_PHONE_SCALE_FLOOR = 0.55;

/** Minimum width used for scale measurement. */
export const BLOG_PHONE_MIN_WIDTH = 240;

const BLOG_ROOT_FONT_PX = 16;

export function blogPhoneScaleFromWidth(widthPx: number): number {
  const w = Math.max(BLOG_PHONE_MIN_WIDTH, widthPx);
  return Math.max(BLOG_PHONE_SCALE_FLOOR, Math.min(1, w / BLOG_PHONE_REF_WIDTH));
}

/** In-app browsers that inflate layout at full device width (LinkedIn, etc.). */
export function inAppBrowserScaleCap(): number | null {
  const ua = navigator.userAgent;
  if (/LinkedInApp/i.test(ua)) return 0.74;
  if (/FBAN|FBAV|Instagram/i.test(ua)) return 0.8;
  return null;
}

export function isBlogInAppBrowser(): boolean {
  return inAppBrowserScaleCap() != null;
}

function measureTextInflation(root: HTMLElement): number {
  const host = root.querySelector(".blog-mobile-canvas") ?? root;
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;font-size:16px;line-height:1;font-family:system-ui,-apple-system,sans-serif;-webkit-text-size-adjust:none;text-size-adjust:none;";
  probe.textContent = "M";
  host.appendChild(probe);
  const computed = parseFloat(getComputedStyle(probe).fontSize);
  host.removeChild(probe);
  if (!Number.isFinite(computed) || computed <= 0) return 1;
  return computed / BLOG_ROOT_FONT_PX;
}

function readBlogViewportWidth(root: HTMLElement): number {
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  const fromRoot = root.clientWidth;
  const candidates = [
    fromRoot > 0 ? fromRoot : 0,
    vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : 0,
    cw,
    iw,
  ].filter((n) => n > 0);
  return Math.max(BLOG_PHONE_MIN_WIDTH, Math.min(...candidates));
}

function computeBlogScale(root: HTMLElement): number {
  const width = readBlogViewportWidth(root);
  let scale = blogPhoneScaleFromWidth(width);

  const inflation = measureTextInflation(root);
  if (inflation > 1.02) {
    scale = Math.max(BLOG_PHONE_SCALE_FLOOR, scale / inflation);
  }

  const cap = inAppBrowserScaleCap();
  if (cap != null) {
    scale = Math.min(scale, cap);
  }

  return scale;
}

function applyBlogScale(
  html: HTMLElement,
  canvas: HTMLElement | null,
  scale: number,
): void {
  const inApp = isBlogInAppBrowser();

  html.style.setProperty("--blog-scale", String(scale));
  html.setAttribute("data-blog-route", "true");
  html.toggleAttribute("data-blog-in-app", inApp);

  if (inApp && scale < 0.995) {
    /*
     * In-app WebViews ignore html font-size but honor transform — scales rem,
     * vmin, svh, and inflated text together (matches Safari reference sizing).
     */
    html.style.setProperty("font-size", `${BLOG_ROOT_FONT_PX}px`, "important");
    if (canvas) {
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = "top left";
      canvas.style.width = `${100 / scale}%`;
      canvas.style.minHeight = `${100 / scale}svh`;
    }
    return;
  }

  html.style.setProperty("font-size", `${BLOG_ROOT_FONT_PX * scale}px`, "important");
  if (canvas) {
    canvas.style.transform = "";
    canvas.style.width = "";
    canvas.style.minHeight = "";
  }
}

function clearBlogScale(html: HTMLElement, canvas: HTMLElement | null): void {
  html.style.fontSize = "";
  html.style.removeProperty("--blog-scale");
  html.removeAttribute("data-blog-route");
  html.removeAttribute("data-blog-in-app");
  if (canvas) {
    canvas.style.transform = "";
    canvas.style.width = "";
    canvas.style.minHeight = "";
  }
}

/**
 * Measures blog viewport and applies uniform scale.
 * Safari: html rem. In-app WebViews: canvas transform (vmin-safe).
 */
export function useBlogPhoneScale(
  rootRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLElement | null>,
): number {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;

    const apply = () => {
      const el = rootRef.current;
      if (!el) return;

      const next = computeBlogScale(el);
      setScale(next);
      applyBlogScale(html, canvasRef.current, next);
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
      clearBlogScale(html, canvasRef.current);
    };
  }, [rootRef, canvasRef]);

  return scale;
}
