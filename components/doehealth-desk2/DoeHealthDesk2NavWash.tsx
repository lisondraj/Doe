"use client";

import { useEffect, useRef } from "react";

const BROWN_SURFACE_SELECTOR = ".doehealth-desk2-nav-wash-surface";
const WASH_MS = 360;
/** Fired by a section whose `data-nav-wash` changed without the page scrolling. */
export const DOEHEALTH_DESK2_NAV_WASH_EVENT = "doehealth-desk2-nav-wash";

function navBand() {
  const nav =
    document.querySelector(".doehealth-desk2-chrome nav.desktop-home-nav") ??
    document.querySelector(".doehealth-desk2-page nav.doephone-site-nav");
  if (!nav) return null;
  const rect = nav.getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom };
}

function bandOverlapsRect(rect: DOMRect, top: number, bottom: number) {
  return rect.top < bottom && rect.bottom > top;
}

/** Ease-out close to cubic-bezier(0.33, 1, 0.68, 1). */
function washEase(t: number) {
  return 1 - (1 - t) ** 3;
}

/** A CSS-style cubic-bezier easing, solved for the progress `x` by bisection. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 24; i += 1) {
      const diff = sampleX(t) - x;
      if (Math.abs(diff) < 1e-5) break;
      if (diff < 0) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

/**
 * /earlypreview: the sections fade their background over 900ms with the CSS `ease` curve. The nav fades on that same
 * time and curve there, so the nav and the section it switches to move together.
 */
const SECTION_FADE_MS = 900;
const sectionFadeEase = cubicBezier(0.25, 0.1, 0.25, 1);

/** Nav inverts while the nav bar overlaps a brown section; reverts on light sections. */
export function DoeHealthDesk2NavWash() {
  const washRef = useRef(0);
  const targetRef = useRef(0);
  const fromRef = useRef(0);
  const startMsRef = useRef(0);
  const animRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    // Pages with the section fade (/earlypreview) pace the nav with it; the others keep the quick nav fade.
    const paced = Boolean(document.querySelector(".earlypreview-page"));
    const fadeMs = paced ? SECTION_FADE_MS : WASH_MS;
    const fadeEase = paced ? sectionFadeEase : washEase;
    let brownNodes: Element[] = [];
    const refreshBrownNodes = () => {
      brownNodes = Array.from(document.querySelectorAll(BROWN_SURFACE_SELECTOR));
    };
    refreshBrownNodes();

    const paintWash = (value: number) => {
      washRef.current = value;
      root.style.setProperty("--desk2-nav-wash", value.toFixed(4));
    };
    // Beige fades on the same curve and time as the wash when a section switches it on or off. A scroll-locked
    // section sends a fraction between 0 and 1 that follows the scroll, so those paint straight away, without a fade.
    const beige = { value: 0, from: 0, target: 0, start: 0, anim: 0 };
    const paintBeige = (value: number) => {
      beige.value = value;
      root.style.setProperty("--desk2-nav-beige", value.toFixed(4));
    };
    const cancelBeige = () => {
      if (beige.anim) cancelAnimationFrame(beige.anim);
      beige.anim = 0;
      beige.start = 0;
    };
    const stepBeige = (now: number) => {
      if (!beige.start) beige.start = now;
      const t = Math.min(1, (now - beige.start) / fadeMs);
      paintBeige(beige.from + (beige.target - beige.from) * fadeEase(t));
      if (t < 1) {
        beige.anim = requestAnimationFrame(stepBeige);
      } else {
        beige.anim = 0;
        beige.start = 0;
      }
    };
    let firstBeige = true;
    const setBeige = (value: number) => {
      if (firstBeige) {
        firstBeige = false;
        beige.target = value;
        paintBeige(value);
        return;
      }
      if (value !== 0 && value !== 1) {
        cancelBeige();
        beige.target = value;
        paintBeige(value);
        return;
      }
      if (beige.target === value) return;
      beige.target = value;
      beige.from = beige.value;
      cancelBeige();
      beige.anim = requestAnimationFrame(stepBeige);
    };

    const stepAnim = (now: number) => {
      if (!startMsRef.current) startMsRef.current = now;
      const t = Math.min(1, (now - startMsRef.current) / fadeMs);
      const value = fromRef.current + (targetRef.current - fromRef.current) * fadeEase(t);
      paintWash(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(stepAnim);
      } else {
        animRef.current = 0;
        startMsRef.current = 0;
      }
    };

    // The first reading after mount sets the nav at once. Only later switches fade, so the nav doesn't flash cream on load.
    let firstWash = true;
    const setTarget = (next: number) => {
      if (firstWash) {
        firstWash = false;
        targetRef.current = next;
        paintWash(next);
        return;
      }
      if (targetRef.current === next) return;
      targetRef.current = next;
      fromRef.current = washRef.current;
      startMsRef.current = 0;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(stepAnim);
    };

    // The nav bar can be missing when this first runs. Waiting for it, rather than reading "no nav" as a light section,
    // keeps the nav from showing cream and then fading to brown on load.
    let navWaits = 0;
    const update = () => {
      const band = navBand();
      if (!band) {
        if (firstWash && navWaits < 120) {
          navWaits += 1;
          tick();
          return;
        }
        setBeige(0);
        setTarget(0);
        return;
      }

      // /earlypreview: the section under the nav's bottom edge decides, so the nav switches the moment a new section
      // touches the bottom of the nav, not once the section before it has fully scrolled past. Other pages keep the
      // first section that overlaps the nav at all.
      const byBottomEdge = Boolean(document.querySelector(".earlypreview-page"));
      const covering = byBottomEdge
        ? brownNodes.find((node) => {
            const rect = node.getBoundingClientRect();
            return rect.top < band.bottom && rect.bottom >= band.bottom;
          })
        : undefined;
      const surface =
        covering ??
        brownNodes.find((node) => bandOverlapsRect(node.getBoundingClientRect(), band.top, band.bottom));
      if (!surface) {
        setBeige(0);
        setTarget(0);
        return;
      }

      // Beige is scroll-driven like the wash: a locked section sets it, and it moves with the page.
      setBeige(Number(surface.getAttribute("data-nav-beige") ?? 0));

      // A scroll-locked section can set its own wash (it changes colour while the page holds still).
      const pinned = Number(surface.getAttribute("data-nav-wash") ?? 1);
      if (pinned < 1) {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        animRef.current = 0;
        startMsRef.current = 0;
        targetRef.current = pinned;
        paintWash(pinned);
        return;
      }
      setTarget(1);
    };

    let scrollFrame = 0;
    const tick = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        update();
      });
    };

    const onResize = () => {
      refreshBrownNodes();
      tick();
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener(DOEHEALTH_DESK2_NAV_WASH_EVENT, tick);
    window.addEventListener("resize", onResize);
    return () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      cancelBeige();
      window.removeEventListener("scroll", tick);
      window.removeEventListener(DOEHEALTH_DESK2_NAV_WASH_EVENT, tick);
      window.removeEventListener("resize", onResize);
      root.style.removeProperty("--desk2-nav-wash");
      root.style.removeProperty("--desk2-nav-beige");
    };
  }, []);

  return null;
}
