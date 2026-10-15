"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

/** Wheel / touch distance (px) that moves a locked section one progress unit. */
const STEP_PX = 320;
/** Ignore input right after the lock engages, so the momentum that carried us in doesn't skip scenes. */
const LOCK_SETTLE_MS = 320;
/**
 * iPhone: Safari's toolbar animates the viewport as it shows or hides, and scroll events fire mid-animation.
 * Re-pinning the page on each of those events fights the animation and reads as a jump, so the lock waits
 * for the viewport to settle and re-aligns once.
 */
const VIEWPORT_SETTLE_MS = 450;
/** Desktop only (same breakpoint as the desk variant): the phone layout is not paced. */
const DESKTOP_QUERY = "(min-width: 1024px)";
/** Desktop only: the most progress per second that wheel or key input can add, so a rapid flick moves no faster than a steady scroll. */
const DESKTOP_PACE_PER_S = 0.75;
/** Desktop only: the most progress that can build up and be spent at once. A single notch always moves right away. */
const DESKTOP_PACE_BURST = 0.5;

/** 0 → 1 as `p` moves through [from, to]. Every motion in a locked section is one of these. */
export function scrollRamp(p: number, [from, to]: readonly [number, number]) {
  return Math.min(1, Math.max(0, (p - from) / (to - from)));
}

/** Custom properties for inline styles. */
export function cssVars(values: Record<string, number>) {
  return values as unknown as CSSProperties;
}

/** Keys typed into a form field belong to the field, not the lock. */
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * Scroll lock for a one-screen section. When its top reaches the top of the viewport the page holds
 * still and scroll input moves progress from 0 to `end` instead; at either end the lock releases and
 * the page scrolls on. Once progress has reached `end` the section is done: it stays on its last scene
 * and never locks again. Returns the progress (the only clock the section's motion uses) and `skip`,
 * which jumps straight to the end.
 */
export function useDoeHealthDesk2ScrollLock(sectionRef: RefObject<HTMLElement>, end: number) {
  const [p, setP] = useState(0);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let progress = 0;
    let locked = false;
    let lockedAt = 0;
    let lastY = window.scrollY;
    let touchY: number | null = null;
    let done = false;
    let doneAt = 0;
    // Desktop pacing: input spends progress from a small bucket that refills at a steady rate.
    let tokens = DESKTOP_PACE_BURST;
    let tokensAt = performance.now();
    // iPhone toolbar: true while the viewport is changing size, so the lock doesn't re-pin mid-animation.
    let settling = false;
    let settleTimer = 0;

    const desktopPaced = () => window.matchMedia(DESKTOP_QUERY).matches;
    const paceDelta = (delta: number) => {
      const now = performance.now();
      tokens = Math.min(DESKTOP_PACE_BURST, tokens + ((now - tokensAt) / 1000) * DESKTOP_PACE_PER_S);
      tokensAt = now;
      const want = delta / STEP_PX;
      const used = Math.sign(want) * Math.min(Math.abs(want), tokens);
      tokens -= Math.abs(used);
      return used * STEP_PX;
    };

    const publish = () => setP(progress);
    const sectionTop = () => window.scrollY + section.getBoundingClientRect().top;
    const jumpTo = (top: number) => window.scrollTo({ top, behavior: "instant" as ScrollBehavior });

    /** While the page is held, the section takes every touch (touch-action: none), so iOS can't pan the page under the lock. */
    const setLocked = (value: boolean) => {
      locked = value;
      section.style.touchAction = value ? "none" : "";
    };

    /**
     * iPhone: a fling that carries the page into the lock keeps scrolling under Safari's own momentum
     * after jumpTo snaps it back, and the lock re-pins against that momentum on every frame it fires —
     * a visible tug-of-war that reads as a bounce. Toggling overflow on the scrolling root is the
     * standard way to kill Safari's inertial scroll outright, so there's nothing left to fight.
     */
    const stopMomentum = () => {
      const { style } = document.documentElement;
      const prev = style.overflowY;
      style.overflowY = "hidden";
      window.requestAnimationFrame(() => {
        style.overflowY = prev;
      });
    };

    const lock = () => {
      setLocked(true);
      lockedAt = performance.now();
      jumpTo(sectionTop());
      stopMomentum();
    };

    const finish = () => {
      done = true;
      doneAt = performance.now();
    };

    /** Feeds scroll input into the section. Returns true when the input was used (and the page must not move). */
    const advance = (delta: number) => {
      if (!locked) return false;
      if (performance.now() - lockedAt < LOCK_SETTLE_MS) return true;
      if (done) {
        // Hold the last scene through the momentum that arrived with it, then let the page go either way.
        if (performance.now() - doneAt < LOCK_SETTLE_MS) return true;
        setLocked(false);
        return false;
      }
      const next = progress + (desktopPaced() ? paceDelta(delta) : delta) / STEP_PX;
      if (next >= end) {
        progress = end;
        finish();
        publish();
        return true;
      }
      if (next < 0) {
        progress = 0;
        setLocked(false);
        publish();
        return false;
      }
      progress = next;
      publish();
      return true;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y - lastY;
      lastY = y;
      const top = section.getBoundingClientRect().top;
      const vh = window.innerHeight;

      if (locked) {
        // A big jump (nav link, keyboard End) leaves the lock instead of being pulled back.
        if (Math.abs(top) > vh * 0.9) {
          setLocked(false);
          progress = done || top < 0 ? end : 0;
          publish();
          return;
        }
        if (settling) return;
        if (Math.abs(top) > 1) {
          jumpTo(sectionTop());
          stopMomentum();
        }
        return;
      }

      if (done) return;

      // Well clear of the section (or jumped past it): settle at the matching end, don't lock.
      if (Math.abs(top) > vh * 0.9) {
        const settled = top < 0 ? end : 0;
        if (progress !== settled) {
          progress = settled;
          publish();
        }
        return;
      }
      // 1px tolerance: a sub-pixel landing (fractional scroll position) still counts as arrived.
      if (dir > 0 && top <= 1 && progress < end) lock();
      else if (dir < 0 && top >= -1 && progress > 0) lock();
    };

    const onWheel = (event: WheelEvent) => {
      if (!locked) return;
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = Math.max(-80, Math.min(80, event.deltaY * scale));
      if (advance(delta)) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (!locked || touchY === null || y === undefined) return;
      const delta = (touchY - y) * 1.6;
      touchY = y;
      if (advance(delta)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!locked || isTyping(event.target)) return;
      const forward = event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ";
      const back = event.key === "ArrowUp" || event.key === "PageUp";
      if (!forward && !back) return;
      if (advance((forward ? 1 : -1) * STEP_PX * 0.6)) event.preventDefault();
    };

    /** Viewport resize (Safari's toolbar): hold corrections while it animates, then re-align once it settles. */
    const onViewportResize = () => {
      if (!locked) return;
      settling = true;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settling = false;
        if (locked && Math.abs(section.getBoundingClientRect().top) > 1) jumpTo(sectionTop());
      }, VIEWPORT_SETTLE_MS);
    };

    skipRef.current = () => {
      progress = end;
      finish();
      publish();
      // Bring the section fully into view; with `done` set it won't lock, so the next scroll moves on.
      setLocked(false);
      jumpTo(sectionTop());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    return () => {
      section.style.touchAction = "";
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
    };
  }, [sectionRef, end]);

  return { p, skip: () => skipRef.current() };
}
