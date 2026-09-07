"use client";

import { useEffect, useRef, useState } from "react";

import { WestfieldEmrPatientChartPreview } from "@/components/doedtc/WestfieldEmrPatientChartPreview";
import { larkenLight } from "@/lib/home/fonts";

function revealClass(segment: "emr", revealed: boolean) {
  return [
    "doedtc2-reveal",
    `doedtc2-reveal--${segment}`,
    revealed ? "doedtc2-reveal--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

/** Share of scroll-track distance where EMR stays put before sliding left. */
const SCROLL_HOLD_RATIO = 0.34;
/** Scroll distance before the nav settles into place. */
const NAV_REVEAL_SCROLL = 72;
/** Scroll distance before the AI button appears. */
const AI_REVEAL_SCROLL = 96;
/** Eased scroll progress where chart finishes sliding left. */
const CHART_SHIFT_END = 0.36;
/** Eased scroll progress window for the simulated AI button press. */
const AI_PRESS_START = 0.42;
const AI_PRESS_END = 0.48;
/** Eased scroll progress where chat panel begins opening. */
const CHAT_REVEAL_START = 0.48;
/** End of phase 1 — left shift, hold, AI press, chat open. */
const PHASE1_END = 0.64;
/** End of chat-open hold — EMR stays left, chat stays open. */
const CHAT_HOLD_END = 0.76;
/** End of phase 3 — chat closes, EMR recenters horizontally. */
const RECENTER_END = 0.87;
/** Hold centered EMR before Results interaction. */
const RESULTS_HOLD_END = 0.885;
/** Scroll progress window for Results tab press animation. */
const RESULTS_PRESS_START = 0.885;
const RESULTS_PRESS_END = 0.905;
/** Scroll progress where Results panel begins revealing. */
const RESULTS_REVEAL_START = 0.89;
/** Scroll progress where Results panel is fully visible. */
const RESULTS_REVEAL_END = 0.915;
/** Hold on Results view before A1c interaction. */
const A1C_HOLD_END = 0.952;
/** Scroll progress window for A1c box press in sidebar. */
const A1C_PRESS_START = 0.952;
const A1C_PRESS_END = 0.968;
/** Scroll progress where A1c sheet begins opening. */
const A1C_SHEET_START = 0.962;
/** Scroll progress where A1c sheet finishes opening. */
const A1C_SHEET_END = 0.986;
/** Hold with A1c modal open before dock phase. */
const A1C_SHEET_HOLD_END = 0.992;
/** Scroll progress where EMR exits right and A1c sheet docks to sidebar. */
const A1C_DOCK_START = 0.992;
/** EMR horizontal shift when docked — positive moves right (half off-screen). */
const CHART_EXIT_SHIFT = 50;
/** Paper coords: module panel right edge and default A1c sheet left. */
const A1C_SHEET_DOCK_LEFT = 612;
const A1C_SHEET_DEFAULT_LEFT = 1276;

/** Max scroll pixels applied per input event (prevents one giant wheel tick from skipping). */
const MAX_PX_PER_EVENT = 64;
/** Max scroll speed while draining toward target (px/ms). */
const MAX_PX_PER_MS = 0.82;
/** Keyboard / page step when capped scroll is active. */
const KEY_SCROLL_STEP = 56;

type ScrollMotion = {
  chartShiftX: number;
  aiPress: number;
  chatReveal: number;
  sideCopyReveal: number;
  resultsTabPress: number;
  resultsReveal: number;
  a1cBoxPress: number;
  a1cSheetReveal: number;
  a1cSheetDock: number;
};

function getScrollMotion(progress: number, aiReveal: number): ScrollMotion {
  const eased = easeOutCubic(progress);

  if (eased <= PHASE1_END) {
    const chartShiftX = easeOutCubic(clamp(eased / CHART_SHIFT_END, 0, 1)) * -50;
    const aiPress =
      aiReveal > 0.92
        ? easeOutCubic(clamp((eased - AI_PRESS_START) / (AI_PRESS_END - AI_PRESS_START), 0, 1))
        : 0;
    const chatReveal = easeOutCubic(clamp((eased - CHAT_REVEAL_START) / (PHASE1_END - CHAT_REVEAL_START), 0, 1));
    const sideCopyReveal = easeOutCubic(clamp(-chartShiftX / 50, 0, 1));
    return {
      chartShiftX,
      aiPress,
      chatReveal,
      sideCopyReveal,
      resultsTabPress: 0,
      resultsReveal: 0,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= CHAT_HOLD_END) {
    return {
      chartShiftX: -50,
      aiPress: 0,
      chatReveal: 1,
      sideCopyReveal: 1,
      resultsTabPress: 0,
      resultsReveal: 0,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= RECENTER_END) {
    const phase3 = easeOutCubic(clamp((eased - CHAT_HOLD_END) / (RECENTER_END - CHAT_HOLD_END), 0, 1));
    return {
      chartShiftX: -50 + phase3 * 50,
      aiPress: 0,
      chatReveal: 1 - phase3,
      sideCopyReveal: Math.max(1 - phase3, 0),
      resultsTabPress: 0,
      resultsReveal: 0,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= RESULTS_HOLD_END) {
    return {
      chartShiftX: 0,
      aiPress: 0,
      chatReveal: 0,
      sideCopyReveal: 0,
      resultsTabPress: 0,
      resultsReveal: 0,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= RESULTS_REVEAL_END) {
    const resultsTabPress = easeOutCubic(
      clamp((eased - RESULTS_PRESS_START) / (RESULTS_PRESS_END - RESULTS_PRESS_START), 0, 1),
    );
    const resultsReveal = easeOutCubic(
      clamp((eased - RESULTS_REVEAL_START) / (RESULTS_REVEAL_END - RESULTS_REVEAL_START), 0, 1),
    );
    return {
      chartShiftX: 0,
      aiPress: 0,
      chatReveal: 0,
      sideCopyReveal: 0,
      resultsTabPress,
      resultsReveal,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= A1C_HOLD_END) {
    return {
      chartShiftX: 0,
      aiPress: 0,
      chatReveal: 0,
      sideCopyReveal: 0,
      resultsTabPress: 1,
      resultsReveal: 1,
      a1cBoxPress: 0,
      a1cSheetReveal: 0,
      a1cSheetDock: 0,
    };
  }

  if (eased <= A1C_SHEET_END) {
    const a1cBoxPress = easeOutCubic(
      clamp((eased - A1C_PRESS_START) / (A1C_PRESS_END - A1C_PRESS_START), 0, 1),
    );
    const a1cSheetReveal = easeOutCubic(
      clamp((eased - A1C_SHEET_START) / (A1C_SHEET_END - A1C_SHEET_START), 0, 1),
    );
    return {
      chartShiftX: 0,
      aiPress: 0,
      chatReveal: 0,
      sideCopyReveal: 0,
      resultsTabPress: 1,
      resultsReveal: 1,
      a1cBoxPress,
      a1cSheetReveal,
      a1cSheetDock: 0,
    };
  }

  if (eased <= A1C_SHEET_HOLD_END) {
    return {
      chartShiftX: 0,
      aiPress: 0,
      chatReveal: 0,
      sideCopyReveal: 0,
      resultsTabPress: 1,
      resultsReveal: 1,
      a1cBoxPress: 1,
      a1cSheetReveal: 1,
      a1cSheetDock: 0,
    };
  }

  const dockProgress = easeOutCubic(clamp((eased - A1C_DOCK_START) / (1 - A1C_DOCK_START), 0, 1));

  return {
    chartShiftX: dockProgress * CHART_EXIT_SHIFT,
    aiPress: 0,
    chatReveal: 0,
    sideCopyReveal: 0,
    resultsTabPress: 1,
    resultsReveal: 1,
    a1cBoxPress: 1,
    a1cSheetReveal: 1,
    a1cSheetDock: dockProgress,
  };
}

function syncMotionVars(
  scroller: HTMLElement,
  motion: ScrollMotion,
  aiReveal: number,
  scrollProgress: number,
) {
  const fabScale = (0.88 + aiReveal * 0.12) * (1 - motion.aiPress * 0.08);
  const a1cDockOffset = motion.a1cSheetDock * (A1C_SHEET_DOCK_LEFT - A1C_SHEET_DEFAULT_LEFT);
  const a1cSlideIn = (1 - motion.a1cSheetReveal) * 100;

  scroller.style.setProperty("--landing-emr-chart-shift", String(motion.chartShiftX));
  scroller.style.setProperty("--landing-emr-chart-shift-x", String(motion.chartShiftX));
  scroller.style.setProperty("--landing-emr-ai-reveal", String(aiReveal));
  scroller.style.setProperty("--landing-emr-ai-press", String(motion.aiPress));
  scroller.style.setProperty("--landing-emr-chat-reveal", String(motion.chatReveal));
  scroller.style.setProperty("--landing-emr-side-copy-reveal", String(motion.sideCopyReveal));
  scroller.style.setProperty("--landing-emr-results-tab-press", String(motion.resultsTabPress));
  scroller.style.setProperty("--landing-emr-results-reveal", String(motion.resultsReveal));
  scroller.style.setProperty("--landing-emr-a1c-box-press", String(motion.a1cBoxPress));
  scroller.style.setProperty("--landing-emr-a1c-sheet-reveal", String(motion.a1cSheetReveal));
  scroller.style.setProperty("--landing-emr-a1c-sheet-dock", String(motion.a1cSheetDock));
  scroller.style.setProperty("--landing-emr-fab-scale", String(fabScale));
  scroller.style.setProperty("--landing-emr-a1c-slide-in", String(a1cSlideIn));
  scroller.style.setProperty("--landing-emr-a1c-dock-offset", `${a1cDockOffset}px`);
  scroller.style.setProperty("--landing-emr-scroll-progress", String(scrollProgress));

  const progressSide = motion.chartShiftX < -5 ? "right" : "left";
  scroller.dataset.progressSide = progressSide;

  scroller.dataset.resultsActive = motion.resultsTabPress >= 1 ? "1" : "0";
  scroller.dataset.resultsPressing =
    motion.resultsTabPress > 0.05 && motion.resultsTabPress < 0.98 ? "1" : "0";
  scroller.dataset.a1cPressing =
    motion.a1cBoxPress > 0.05 && motion.a1cBoxPress < 0.98 ? "1" : "0";
  scroller.dataset.aiFabVisible = aiReveal > 0.05 ? "1" : "0";
  scroller.dataset.aiFabPressed = motion.aiPress > 0.08 ? "1" : "0";
}

function setupCappedScroll(scroller: HTMLElement, scheduleUpdate: () => void) {
  let targetScroll = scroller.scrollTop;
  let rafId = 0;
  let lastFrameTime = 0;
  let touchLastY: number | null = null;

  const maxScroll = () => Math.max(scroller.scrollHeight - scroller.clientHeight, 0);

  const clampTarget = (value: number) => clamp(value, 0, maxScroll());

  const setScrollTop = (next: number) => {
    const clamped = clampTarget(next);
    scroller.scrollTop = clamped;
    targetScroll = clamped;
    scheduleUpdate();
  };

  const scheduleDrain = () => {
    if (rafId !== 0) return;
    rafId = window.requestAnimationFrame(drainFrame);
  };

  const drainFrame = (time: number) => {
    rafId = 0;
    const dt = lastFrameTime > 0 ? Math.min(time - lastFrameTime, 32) : 16;
    lastFrameTime = time;

    const delta = targetScroll - scroller.scrollTop;
    if (Math.abs(delta) < 0.5) {
      if (Math.abs(scroller.scrollTop - targetScroll) >= 0.5) {
        setScrollTop(targetScroll);
      }
      return;
    }

    const step = MAX_PX_PER_MS * dt;
    if (Math.abs(delta) <= step) {
      setScrollTop(targetScroll);
      return;
    }

    setScrollTop(scroller.scrollTop + Math.sign(delta) * step);
    scheduleDrain();
  };

  const addToTarget = (delta: number) => {
    const capped = clamp(delta, -MAX_PX_PER_EVENT, MAX_PX_PER_EVENT);
    targetScroll = clampTarget(targetScroll + capped);
    scheduleDrain();
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    addToTarget(event.deltaY);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchLastY = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event: TouchEvent) => {
    const y = event.touches[0]?.clientY;
    if (y == null || touchLastY == null) return;
    event.preventDefault();
    addToTarget(touchLastY - y);
    touchLastY = y;
  };

  const onTouchEnd = () => {
    touchLastY = null;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const max = maxScroll();
    if (max <= 0) return;

    let delta = 0;
    switch (event.key) {
      case "ArrowDown":
        delta = KEY_SCROLL_STEP;
        break;
      case "ArrowUp":
        delta = -KEY_SCROLL_STEP;
        break;
      case "PageDown":
        delta = scroller.clientHeight * 0.9;
        break;
      case "PageUp":
        delta = -scroller.clientHeight * 0.9;
        break;
      case " ":
        delta = event.shiftKey ? -scroller.clientHeight * 0.9 : scroller.clientHeight * 0.9;
        break;
      case "Home":
        targetScroll = 0;
        scheduleDrain();
        event.preventDefault();
        return;
      case "End":
        targetScroll = max;
        scheduleDrain();
        event.preventDefault();
        return;
      default:
        return;
    }

    event.preventDefault();
    addToTarget(delta);
  };

  const onResize = () => {
    targetScroll = clampTarget(targetScroll);
    if (Math.abs(scroller.scrollTop - targetScroll) > 0.5) {
      scheduleDrain();
    }
  };

  scroller.addEventListener("wheel", onWheel, { passive: false });
  scroller.addEventListener("touchstart", onTouchStart, { passive: true });
  scroller.addEventListener("touchmove", onTouchMove, { passive: false });
  scroller.addEventListener("touchend", onTouchEnd, { passive: true });
  scroller.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);

  return () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
    }
    scroller.removeEventListener("wheel", onWheel);
    scroller.removeEventListener("touchstart", onTouchStart);
    scroller.removeEventListener("touchmove", onTouchMove);
    scroller.removeEventListener("touchend", onTouchEnd);
    scroller.removeEventListener("touchcancel", onTouchEnd);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
  };
}

export function LandingEmrScrollScene() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scroller = track.closest(".doedtc2-landing") as HTMLElement | null;
    if (!scroller) return;

    const nav = scroller.parentElement?.querySelector(".landing-emr-top-nav") as HTMLElement | null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const build = scroller.parentElement;
    let cachedNavHeight = nav?.offsetHeight ?? 0;
    let cachedTrackTop = 0;
    let cachedAnimDistance = 1;
    let updateRafId = 0;

    const refreshTrackMetrics = () => {
      cachedTrackTop =
        track.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      cachedAnimDistance = Math.max(track.offsetHeight - scroller.clientHeight, 1);
    };

    const syncStageLayout = (scrollTop: number) => {
      const progressReveal = reduced ? 1 : clamp(scrollTop / NAV_REVEAL_SCROLL, 0, 1);
      build?.style.setProperty("--landing-emr-nav-reveal", String(progressReveal));
      scroller.style.setProperty("--landing-emr-nav-reveal", String(progressReveal));

      if (nav) {
        nav.style.pointerEvents = progressReveal > 0.95 ? "auto" : "none";
      }

      const navStack = Math.max((cachedNavHeight + 14) * progressReveal, 0);
      const stageHeight = Math.max(scroller.clientHeight - navStack, 0);

      scroller.style.setProperty("--landing-emr-nav-stack", `${navStack}px`);
      scroller.style.setProperty("--landing-emr-stage-height", `${stageHeight}px`);
    };

    const update = () => {
      const scrollTop = scroller.scrollTop;
      syncStageLayout(scrollTop);

      const maxScroll = Math.max(scroller.scrollHeight - scroller.clientHeight, 1);
      const scrollProgress = clamp(scrollTop / maxScroll, 0, 1);

      if (reduced) {
        syncMotionVars(scroller, getScrollMotion(1, 1), 1, scrollProgress);
        return;
      }

      const aiReveal = clamp((scrollTop - 24) / AI_REVEAL_SCROLL, 0, 1);
      const raw = clamp((scrollTop - cachedTrackTop) / cachedAnimDistance, 0, 1);
      const progress =
        raw <= SCROLL_HOLD_RATIO
          ? 0
          : clamp((raw - SCROLL_HOLD_RATIO) / (1 - SCROLL_HOLD_RATIO), 0, 1);

      syncMotionVars(scroller, getScrollMotion(progress, aiReveal), aiReveal, scrollProgress);
    };

    const scheduleUpdate = () => {
      if (updateRafId !== 0) return;
      updateRafId = window.requestAnimationFrame(() => {
        updateRafId = 0;
        update();
      });
    };

    refreshTrackMetrics();
    update();

    const navObserver = nav
      ? new ResizeObserver(() => {
          cachedNavHeight = nav.offsetHeight;
          scheduleUpdate();
        })
      : null;
    navObserver?.observe(nav as HTMLElement);

    const trackObserver = new ResizeObserver(() => {
      refreshTrackMetrics();
      scheduleUpdate();
    });
    trackObserver.observe(track);

    const teardownCap = reduced ? null : setupCappedScroll(scroller, scheduleUpdate);

    const onResize = () => {
      refreshTrackMetrics();
      scheduleUpdate();
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (updateRafId !== 0) {
        window.cancelAnimationFrame(updateRafId);
      }
      teardownCap?.();
      navObserver?.disconnect();
      trackObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className="landing-emr-scroll-progress" aria-hidden role="presentation">
        <div className="landing-emr-scroll-progress__fill" />
      </div>
      <div ref={trackRef} className="landing-emr-scroll-track">
        <div className="landing-emr-scroll-sticky">
          <div className="landing-emr-dual-stage">
            <div className="landing-emr-dual-stage__chart-wrap">
              <div className={revealClass("emr", revealed)}>
                <WestfieldEmrPatientChartPreview />
              </div>
            </div>
            <div
              className={`landing-emr-stage-copy landing-emr-stage-copy--left ${larkenLight.className}`}
              aria-hidden
            >
              <p className="landing-emr-stage-copy__line">One step</p>
              <p className="landing-emr-stage-copy__line">ahead of you.</p>
            </div>
            <div className={`landing-emr-stage-copy ${larkenLight.className}`} aria-hidden>
              <p className="landing-emr-stage-copy__line">Intelligence</p>
              <p className="landing-emr-stage-copy__line">built for you.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
