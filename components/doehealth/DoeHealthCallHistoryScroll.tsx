"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

/** Slow auto-drift through embedded call history convo — scrollTop-driven, no manual scroll. */
export function DoeHealthCallHistoryScroll({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let lastTime = performance.now();
    let direction = 1;
    let pauseUntil = performance.now() + 700;
    /** ~11px/s — slow, clearly perceptible drift */
    const speedPxPerMs = 0.011;
    const edgePauseMs = 2400;
    let running = true;

    const travel = () => Math.max(0, viewport.scrollHeight - viewport.clientHeight);

    const preventManualScroll = (event: Event) => {
      event.preventDefault();
    };

    viewport.addEventListener("wheel", preventManualScroll, { passive: false });
    viewport.addEventListener("touchmove", preventManualScroll, { passive: false });

    const tick = (now: number) => {
      if (!running) return;

      if (reducedMotion.matches) {
        viewport.scrollTop = 0;
        frame = requestAnimationFrame(tick);
        return;
      }

      const scrollRange = travel();

      if (scrollRange > 2 && now >= pauseUntil) {
        const delta = Math.min(now - lastTime, 48);
        lastTime = now;

        let next = viewport.scrollTop + delta * speedPxPerMs * direction;

        if (next >= scrollRange - 0.5) {
          next = scrollRange;
          direction = -1;
          pauseUntil = now + edgePauseMs;
        } else if (next <= 0.5) {
          next = 0;
          direction = 1;
          pauseUntil = now + edgePauseMs;
        }

        viewport.scrollTop = next;
      } else {
        lastTime = now;
      }

      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (reducedMotion.matches) {
        viewport.scrollTop = 0;
      } else {
        viewport.scrollTop = Math.min(viewport.scrollTop, travel());
        pauseUntil = performance.now() + 700;
      }
      lastTime = performance.now();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(viewport);
    const content = viewport.firstElementChild;
    if (content) resizeObserver.observe(content);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) sync();
      },
      { rootMargin: "20% 0px", threshold: 0 },
    );
    intersectionObserver.observe(viewport);

    void document.fonts.ready.then(sync);
    requestAnimationFrame(() => {
      requestAnimationFrame(sync);
    });
    sync();

    const onReducedMotionChange = () => sync();
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      viewport.removeEventListener("wheel", preventManualScroll);
      viewport.removeEventListener("touchmove", preventManualScroll);
    };
  }, []);

  return (
    <div ref={viewportRef} className="doehealth-initiatives__call-history-scroll">
      {children}
    </div>
  );
}
