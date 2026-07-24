"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

/** Slow auto-drift through embedded call history convo — scrolls once to bottom, then pauses. */
export function DoeHealthCallHistoryScroll({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const driftClass = "doehealth-initiatives__call-history-scroll__track--drift";

    const measureContentHeight = () => {
      const content = track.firstElementChild as HTMLElement | null;
      if (!content) return track.scrollHeight;
      return Math.max(content.scrollHeight, content.getBoundingClientRect().height, track.scrollHeight);
    };

    const sync = () => {
      const viewportHeight = viewport.clientHeight;
      const contentHeight = measureContentHeight();
      const travel = Math.max(0, contentHeight - viewportHeight);

      viewport.style.setProperty("--dhi-scroll-travel", `${travel}px`);
      /** ~7px/s — slow but clearly visible */
      viewport.style.setProperty("--dhi-scroll-duration", `${Math.max(16, travel / 7)}s`);

      const shouldDrift = !reducedMotion.matches && travel > 12;
      track.classList.toggle(driftClass, shouldDrift);

      if (!shouldDrift) {
        track.style.transform = "";
      }
    };

    const preventManualScroll = (event: Event) => {
      event.preventDefault();
    };

    viewport.addEventListener("wheel", preventManualScroll, { passive: false });
    viewport.addEventListener("touchmove", preventManualScroll, { passive: false });

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(viewport);
    const content = track.firstElementChild;
    if (content) resizeObserver.observe(content);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) sync();
      },
      { rootMargin: "20% 0px", threshold: 0 },
    );
    intersectionObserver.observe(viewport);

    const onReducedMotionChange = () => sync();
    reducedMotion.addEventListener("change", onReducedMotionChange);

    void document.fonts.ready.then(sync);
    requestAnimationFrame(() => {
      requestAnimationFrame(sync);
    });
    sync();

    return () => {
      track.classList.remove(driftClass);
      track.style.transform = "";
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      viewport.removeEventListener("wheel", preventManualScroll);
      viewport.removeEventListener("touchmove", preventManualScroll);
    };
  }, []);

  return (
    <div ref={viewportRef} className="doehealth-initiatives__call-history-scroll">
      <div ref={trackRef} className="doehealth-initiatives__call-history-scroll__track">
        {children}
      </div>
    </div>
  );
}
