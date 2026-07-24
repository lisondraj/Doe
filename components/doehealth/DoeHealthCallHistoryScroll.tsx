"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Slow auto-drift through embedded call history convo — transform-driven, no manual scroll. */
export function DoeHealthCallHistoryScroll({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let lastTime = performance.now();
    let offset = 0;
    let direction = 1;
    let pauseUntil = performance.now() + 700;
    /** ~11px/s — slow, clearly perceptible drift */
    const speedPxPerMs = 0.011;
    const edgePauseMs = 2400;
    let running = true;

    const travel = () => Math.max(0, track.scrollHeight - viewport.clientHeight);

    const applyOffset = (next: number) => {
      offset = next;
      track.style.transform = `translate3d(0, ${-offset}px, 0)`;
    };

    const preventManualScroll = (event: Event) => {
      event.preventDefault();
    };

    viewport.addEventListener("wheel", preventManualScroll, { passive: false });
    viewport.addEventListener("touchmove", preventManualScroll, { passive: false });

    const tick = (now: number) => {
      if (!running) return;

      if (reducedMotion.matches) {
        applyOffset(0);
        frame = requestAnimationFrame(tick);
        return;
      }

      const scrollRange = travel();

      if (scrollRange > 2 && now >= pauseUntil) {
        const delta = Math.min(now - lastTime, 48);
        lastTime = now;

        let next = offset + delta * speedPxPerMs * direction;

        if (next >= scrollRange - 0.5) {
          next = scrollRange;
          direction = -1;
          pauseUntil = now + edgePauseMs;
        } else if (next <= 0.5) {
          next = 0;
          direction = 1;
          pauseUntil = now + edgePauseMs;
        }

        applyOffset(next);
      } else {
        lastTime = now;
      }

      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const scrollRange = travel();
      offset = Math.min(offset, scrollRange);
      applyOffset(offset);
      lastTime = performance.now();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    void document.fonts.ready.then(sync);
    sync();

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        applyOffset(0);
      } else {
        pauseUntil = performance.now() + 700;
        sync();
      }
    };
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
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
