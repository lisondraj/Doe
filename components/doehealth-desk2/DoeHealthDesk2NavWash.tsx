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

/** Nav inverts while the nav bar overlaps a brown section; reverts on light sections. */
export function DoeHealthDesk2NavWash() {
  const washRef = useRef(0);
  const targetRef = useRef(0);
  const fromRef = useRef(0);
  const startMsRef = useRef(0);
  const animRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    let brownNodes: Element[] = [];
    const refreshBrownNodes = () => {
      brownNodes = Array.from(document.querySelectorAll(BROWN_SURFACE_SELECTOR));
    };
    refreshBrownNodes();

    const paintWash = (value: number) => {
      washRef.current = value;
      root.style.setProperty("--desk2-nav-wash", value.toFixed(4));
    };
    const paintBeige = (value: number) => {
      root.style.setProperty("--desk2-nav-beige", value.toFixed(4));
    };

    const stepAnim = (now: number) => {
      if (!startMsRef.current) startMsRef.current = now;
      const t = Math.min(1, (now - startMsRef.current) / WASH_MS);
      const value = fromRef.current + (targetRef.current - fromRef.current) * washEase(t);
      paintWash(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(stepAnim);
      } else {
        animRef.current = 0;
        startMsRef.current = 0;
      }
    };

    const setTarget = (next: number) => {
      if (targetRef.current === next) return;
      targetRef.current = next;
      fromRef.current = washRef.current;
      startMsRef.current = 0;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(stepAnim);
    };

    const update = () => {
      const band = navBand();
      if (!band) {
        paintBeige(0);
        setTarget(0);
        return;
      }

      const surface = brownNodes.find((node) =>
        bandOverlapsRect(node.getBoundingClientRect(), band.top, band.bottom),
      );
      if (!surface) {
        paintBeige(0);
        setTarget(0);
        return;
      }

      // Beige is scroll-driven like the wash: a locked section sets it, and it moves with the page.
      paintBeige(Number(surface.getAttribute("data-nav-beige") ?? 0));

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
      window.removeEventListener("scroll", tick);
      window.removeEventListener(DOEHEALTH_DESK2_NAV_WASH_EVENT, tick);
      window.removeEventListener("resize", onResize);
      root.style.removeProperty("--desk2-nav-wash");
      root.style.removeProperty("--desk2-nav-beige");
    };
  }, []);

  return null;
}
