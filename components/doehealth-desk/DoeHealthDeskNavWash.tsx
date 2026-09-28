"use client";

import { useEffect, useRef } from "react";

const BROWN_SURFACE_SELECTOR = ".doehealth-desk-nav-wash-surface";
const WASH_MS = 360;

function navBand() {
  const nav = document.querySelector(".doehealth-desk-chrome nav.desktop-home-nav");
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
export function DoeHealthDeskNavWash() {
  const washRef = useRef(0);
  const targetRef = useRef(0);
  const fromRef = useRef(0);
  const startMsRef = useRef(0);
  const animRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;

    const paintWash = (value: number) => {
      washRef.current = value;
      root.style.setProperty("--desk-nav-wash", value.toFixed(4));
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
        setTarget(0);
        return;
      }

      let onBrown = false;
      for (const node of document.querySelectorAll(BROWN_SURFACE_SELECTOR)) {
        if (bandOverlapsRect(node.getBoundingClientRect(), band.top, band.bottom)) {
          onBrown = true;
          break;
        }
      }

      setTarget(onBrown ? 1 : 0);
    };

    let scrollFrame = 0;
    const tick = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(update);
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      cancelAnimationFrame(scrollFrame);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      root.style.removeProperty("--desk-nav-wash");
    };
  }, []);

  return null;
}
